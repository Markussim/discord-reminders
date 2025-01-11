import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import axios from "axios";

export const handler = async (event) => {
  const secret_name = "prod/reminder";

  const client = new SecretsManagerClient({
    region: "eu-north-1",
  });

  let response = await client.send(
    new GetSecretValueCommand({ SecretId: secret_name })
  );

  let parsedSecret = JSON.parse(response.SecretString);

  let webhook = parsedSecret.webhook;

  let message = {
    content: event.body,
  };

  await axios.post(webhook, message);

  return { statusCode: 200, body: JSON.stringify(webhook) };
};

// handler({ body: "Hello, World!" });
