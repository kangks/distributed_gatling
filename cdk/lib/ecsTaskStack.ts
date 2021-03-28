import ecs = require('@aws-cdk/aws-ecs');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require("@aws-cdk/aws-iam");
import cdk = require('@aws-cdk/core');
// import { ApplicationLoadBalancedFargateService } from "@aws-cdk/aws-ecs-patterns";
import path = require('path');

export class DistributedECSTaskStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
  
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
          "JAVA_OPTS": "-Dweb.baseUrl=http://simpl-simpl-1tvem419lsgf7-18442615.us-west-1.elb.amazonaws.com"
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