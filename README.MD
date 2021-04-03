# Site Reliability using AWS Fargate with CDK and Gatling

This repository conists of the `cdk` stacks that build the Docker image from the `gatling` folder, push to `ECR` and provision the infrastructure. Details can be found in [Site Reliability using AWS Fargate with CDK and Gatling](https://richard-kang.medium.com/site-reliability-using-aws-fargate-with-cdk-and-gatling-18d340a43588)

## CDK application

The application consists of 2 stacks, `DistributedECSTaskStack` and `SimpleFargateWebService`, which can be deployed with command `cdk deploy ecsLoadTestTask` and `cdk deploy simpleWebFargate` respectively.

## DistributedECSTaskStack

`DistributedECSTaskStack` builds the Docker image locally, push the image to `ECR` and provision the AWS Fargate to run the `gatling`.

![DistributedECSTaskStack architecture diagram](images/Gatling%20Fargate%20-%20gatling.png)

## SimpleFargateWebService

Another stack, `SimpleFargateWebService` is an example of `system-under-test` (SUT) that the `Gatling` will test against. The stack uses Docker image `amazon/amazon-ecs-sample` which is a simple PHP web application.

![SimpleFargateWebService architecture diagram](images/Gatling%20Fargate%20-%20simple%20web.png)

