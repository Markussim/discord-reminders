import {
  CreateScheduleCommand,
  SchedulerClient,
} from "@aws-sdk/client-scheduler";
// import { LambdaClient, AddPermissionCommand } from "@aws-sdk/client-lambda";

export const handler = async (event) => {
  // Create an EventBridge client for lambda function "messageSender" with body and time
  let body = JSON.parse(event.body);
  let time = new Date(body.time);

  console.log(body.time);

  const client = new SchedulerClient({
    region: "eu-north-1",
  });

  // Create a new schedule
  const params = {
    Name: "reminder" + Date.now(),
    Description: "Send a reminder",
    ScheduleExpression: dateToAt(time),
    Description: "Send a reminder",
    State: "ENABLED",
    ActionAfterCompletion: "DELETE",
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
    GroupName: "reminderGroup",
    State: "ENABLED",
    Target: {
      Arn: "arn:aws:lambda:eu-north-1:016131845196:function:messageSender",
      RoleArn:
        "arn:aws:iam::016131845196:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA_26cb3b4e42",
    },
  };

  let response = await client.send(new CreateScheduleCommand(params));

  return { statusCode: 200, body: JSON.stringify(response) };
};

// Test event
// handler({ body: '{"time":"2025-01-11T16:55:00Z","body":"Hello, World!"}' });

function dateToAt(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid Date object");
  }
  const pad = (number) => number.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `at(${year}-${month}-${day}T${hours}:${minutes}:${seconds})`;
}
