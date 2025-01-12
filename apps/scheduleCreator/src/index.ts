import {
  CreateScheduleCommand,
  SchedulerClient,
  CreateScheduleCommandInput,
} from "@aws-sdk/client-scheduler";

interface Event {
  time: string;
  content: string;
}

export const handler = async (event: Event) => {
  try {
    const time = new Date(event.time);
    console.log(event.time);

    const client = new SchedulerClient({ region: "eu-north-1" });
    const input = JSON.stringify({ message: event.content });

    const params: CreateScheduleCommandInput = {
      Name: "reminder" + Date.now(),
      Description: "Send a reminder",
      ScheduleExpression: dateToAt(time),
      State: "ENABLED",
      ActionAfterCompletion: "DELETE",
      FlexibleTimeWindow: { Mode: "OFF" },
      GroupName: "reminderGroup",
      Target: {
        Arn: process.env.target_lambda_arn!,
        RoleArn: process.env.invoker_role_arn!,
        Input: input,
      },
    };

    const response = await client.send(new CreateScheduleCommand(params));
    console.log("Schedule created:", response);

    return { statusCode: 200, body: "Success" };
  } catch (error) {
    console.error("Error creating schedule:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};

// Helper function to generate ScheduleExpression for EventBridge Scheduler
function dateToAt(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid Date object");
  }
  const pad = (number: number) => number.toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // Months are zero-indexed
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `at(${year}-${month}-${day}T${hours}:${minutes}:${seconds})`;
}

// Test the function (Uncomment for local testing)
// handler({ time: "2025-01-11T16:35:00Z", content: "Hello, World!" });
