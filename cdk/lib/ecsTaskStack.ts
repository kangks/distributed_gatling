import ecs = require('@aws-cdk/aws-ecs');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require("@aws-cdk/aws-iam");
import cdk = require('@aws-cdk/core');
import log = require('@aws-cdk/aws-logs');
import path = require('path');
import { CfnParameter } from '@aws-cdk/core';

export class DistributedECSTaskStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      const webBaseUrl = new CfnParameter(this, "webBaseUrl", 
        {
          type: "String",
          description: "The URL of the web service to be tested",
          default: "http://localhost"
        });
    
      const loadRps = new CfnParameter(this, "loadRps", 
        {
          type: "String",
          description: "The concurrent requests per second",
          default: "1"
        });

      const loadDurationInSeconds = new CfnParameter(this, "loadDurationInSeconds", 
        {
          type: "String",
          description: "The duration of the load in seconds",
          default: "1"
        });

      const cluster = new ecs.Cluster(this, "gatlingCluster")

      const executionRole = new iam.Role(this, "TaskExecutionRole", {
        assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com")
      });
      executionRole.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonECSTaskExecutionRolePolicy"
        )
      );
  
      const taskRole = new iam.Role(this, "TaskRole", {
        assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com")
      });
      taskRole.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonECSTaskExecutionRolePolicy"
        )
      );    
  
      const logging = new ecs.AwsLogDriver({
        streamPrefix: "gatling",
        logGroup: new log.LogGroup(this, 'gatlingLogGroup', {
          logGroupName: 'perfTest',
          retention: log.RetentionDays.ONE_DAY,
          removalPolicy: cdk.RemovalPolicy.DESTROY
        })
      })    

      const taskDef = new ecs.FargateTaskDefinition(this, "TaskDefinition", {
        cpu: 256,
        memoryLimitMiB: 512,
        executionRole: executionRole,
        taskRole: taskRole
      });
  
      const containerDef = new ecs.ContainerDefinition(this, 'containerDef', {
        taskDefinition: taskDef,
        logging: logging,
        image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, '../../gatling'), {file: "Dockerfile"}),
        command: [ "gatling.sh", "-sf", "/tests/test", "-s", "perfTest.simulations.WebServiceSimulation" ],
        environment: {
          "GATLING_CONF": "/tests/test/resources",
          "JAVA_OPTS": 
            "-Dweb.baseUrl=" + webBaseUrl.valueAsString + " " +
            "-Dload.rps=" + loadRps.valueAsString + " " +
            "-Dload.durationInSeconds=" + loadDurationInSeconds.valueAsString
        },
        workingDirectory: "/tests/test"
      })
  
      const service = new ecs.FargateService(this, 
        "gatlingTask", 
        {
          cluster: cluster,
          taskDefinition: taskDef,
          desiredCount: 1
        }
      );
    }
  }