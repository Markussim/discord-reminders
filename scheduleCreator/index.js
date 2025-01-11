import {
  CreateScheduleCommand,
  SchedulerClient,
} from "@aws-sdk/client-scheduler";
// import { LambdaClient, AddPermissionCommand } from "@aws-sdk/client-lambda";

export const handler = async (event) => {
  try {
    // Create an EventBridge client for lambda function "messageSender" with body and time
    let body = event;
    let time = new Date(body.time);

    console.log(body.time);

    const client = new SchedulerClient({
      region: "eu-north-1",
    });

    const input = JSON.stringify({ message: body.content });

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
        Input: input,
      },
    };

    let response = await client.send(new CreateScheduleCommand(params));

    return { statusCode: 200, body: "Success" };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};

// Test event
// console.log(
//   await handler({
//     body: '{"time":"2025-01-11T16:35:00Z","content":"Hello, World!"}',
//   })
// );

function dateToAt(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid Date object");
  }
  const pad = (number) => number.toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // Months are zero-indexed
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `at(${year}-${month}-${day}T${hours}:${minutes}:${seconds})`;
}
