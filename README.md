# Discord Reminders
A project designed to manage and send scheduled reminders via Discord using a modular architecture. This project includes multiple applications for managing and sending messages, creating schedules, and an associated infrastructure defined with Terraform.
## Project Structure
### `apps/client`
This directory contains the client-side application. It may include the front-facing logic for interacting with the Discord API and managing reminders.
- **Entry Point:** `src/index.tsx`

### `apps/messageSender`
Handles the sending of the scheduled messages to Discord channels.
- **Entry Point:** `src/index.ts`
- Likely handles integration with the Discord API for sending messages.

### `apps/scheduleCreator`
Allows creation of schedules for reminders, likely storing the schedules in some database or resource.
- **Entry Point:** `src/index.ts`
- Responsible for defining and managing schedules for reminders.

### `terraform`
Defines the infrastructure used by the project in a declarative manner using Terraform.
- **File:** `main.tf`
- Provisions cloud services or resources required for the project (e.g., databases, compute resources, etc.).

## Technologies Used
- **Programming Language:** TypeScript
- **Frontend Framework:** Preact
- **Infrastructure:** Terraform for IaC (Infrastructure as Code)
- **Discord API Integration:** For message sending and handling reminders.

## Installation
1. Clone the repository:
``` bash
   git clone https://github.com/yourusername/discord-reminders.git
   cd discord-reminders
```
1. Install dependencies for each app:
``` bash
   cd apps/client && npm install
   cd ../messageSender && npm install
   cd ../scheduleCreator && npm install
```
1. Deploy the infrastructure with Terraform:
``` bash
   cd terraform
   terraform init
   terraform apply
```
## Usage
1. **Start the Client:**
``` bash
   cd apps/client
   npm start
```
1. **Run the Message Sender:**
``` bash
   cd apps/messageSender
   npm start
```
1. **Run the Schedule Creator:**
``` bash
   cd apps/scheduleCreator
   npm start
```
## Contribution
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a pull request.

## License
`discord-reminders` is free and open-source software licensed under the MIT License.