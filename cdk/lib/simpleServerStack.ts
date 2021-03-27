import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');
import iam = require("@aws-cdk/aws-iam");
import { ApplicationLoadBalancedFargateService } from "@aws-cdk/aws-ecs-patterns";

export class SimpleFargateWebService extends cdk.Stack {
  public readonly url: cdk.CfnOutput

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
      streamPrefix: "web",
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
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    })

    containerDef.addPortMappings({
      containerPort: 80,
      protocol: ecs.Protocol.TCP
    });    

    const service = new ApplicationLoadBalancedFargateService(this, 
      "simpleWebService", 
      {
        serviceName: 'webService',
        taskDefinition: taskDef,
        listenerPort: 80,
        desiredCount: 1, 
        publicLoadBalancer: true,
      }
    );

    this.url = new cdk.CfnOutput(this, 'SvcUrl', {value: service.loadBalancer.loadBalancerDnsName})
  }  
}