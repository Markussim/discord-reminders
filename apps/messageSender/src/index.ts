import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import axios from "axios";

interface Event {
  message: string;
}

export const handler = async (event: Event) => {
  const secret_name = "prod/reminder";

  const client = new SecretsManagerClient({
    region: "eu-north-1",
  });

  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secret_name })
  );

  const parsedSecret = JSON.parse(response.SecretString!);
  const webhook: string = parsedSecret.webhook;

  const message = {
    content: event.message,
  };

  await axios.post(webhook, message);

  return { statusCode: 200, body: JSON.stringify({ webhook }) };
};
