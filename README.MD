# Site Reliability using AWS Fargate with CDK and Gatling

This repository conists of the `cdk` stacks that build the Docker image from the `gatling` folder, push to `ECR` and provision the infrastructure. Details can be found in [Site Reliability using AWS Fargate with CDK and Gatling](https://richard-kang.medium.com/site-reliability-using-aws-fargate-with-cdk-and-gatling-18d340a43588)

## CDK application

The application consists of 2 stacks, `DistributedECSTaskStack` and `SimpleFargateWebService`, which can be deployed with command `cdk deploy ecsLoadTestTask` and `cdk deploy simpleWebFargate` respectively.

## DistributedECSTaskStack

`DistributedECSTaskStack` builds the Docker image locally, push the image to `ECR` and provision the AWS Fargate to run the `gatling`.

![DistributedECSTaskStack architecture diagram](images/Gatling%20Fargate%20-%20gatling.png)

### How to deploy the stack

** Note **: `cdk deploy` takes the stake name defined in the cdk.App. In this example, `DistributedECSTaskStack` is defined as `ecsLoadTestTask` in [`app.ts`](https://github.com/kangks/distributed_gatling/blob/master/cdk/bin/app.ts#L6)

```
new DistributedECSTaskStack(app, 'ecsLoadTestTask' );
```

1. Make sure `cdk` is installed. The command to install is `npm install -g aws-cdk@latest`
2. Runs the `npm run build` in the `cdk/` folder
3. The `DistributedECSTaskStack` stake allows override of parameters during stake creation. For example, the web service endpoint can be overrided with `cdk deploy ecsLoadTestTask --parameters webBaseUrl=http://localhost`
4. Other `CfnParameter` are:
   * `loadRps` - the concurrent connections per seconds
   * `loadDurationInSeconds` - the total duration of the pressure to be applied in seconds

## SimpleFargateWebService

Another stack, `SimpleFargateWebService` is an example of `system-under-test` (SUT) that the `Gatling` will test against. The stack uses Docker image `amazon/amazon-ecs-sample` which is a simple PHP web application.

![SimpleFargateWebService architecture diagram](images/Gatling%20Fargate%20-%20simple%20web.png)


### How to deploy the stack

1. Make sure `cdk` is installed. The command to install is `npm install -g aws-cdk@latest`
2. Runs the `npm run build` in the `cdk/` folder
3. Deploy with command `cdk deploy simpleWebFargate`. CDK will ask for confirmation on the changes to be applied, review it and enter `y` if the changes are as expected. 
4. If the deployment was successful, the URL of the simple web service will be shown in the Outputs:

```
✅  simpleWebFargate

Outputs:
simpleWebFargate.SvcUrl = simpl-simpl-<GUID>.<AWS REGION>.elb.amazonaws.com
simpleWebFargate.simpleWebServiceLoadBalancer<DNS ID> = simpl-simpl-<GUID>.<AWS REGION>.elb.amazonaws.com
simpleWebFargate.simpleWebServiceService<DNS ID> = http://simpl-simpl-<GUID>.<AWS REGION>.elb.amazonaws.com

Stack ARN:
arn:aws:cloudformation:<AWS REGION>:<AWS ACCOUNT>:stack/simpleWebFargate/<STACK ID>
```