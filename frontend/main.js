const testUsers = [
  { name: "Ant", discordId: "231711102931697665" },
  { name: "Mack", discordId: "292403753360031745" },
  { name: "Liss", discordId: "400691601011113986" },
  { name: "Svant", discordId: "225636267633803274" },
  { name: "@ genuine cheese people", discordId: "&690485351302692884" },
];

// Sort users by name
testUsers.sort((a, b) => a.name.localeCompare(b.name));

const tagShortcuts = document.getElementById("tagShortcuts");
for (const user of testUsers) {
  const tag = document.createElement("button");
  tag.innerHTML = user.name;
  tag.onclick = () => {
    const textarea = document.getElementById("message");
    textarea.value += `<@${user.discordId}>`;
  };
  tagShortcuts.appendChild(tag);
}

const url = "https://xcr2agxdue.execute-api.eu-north-1.amazonaws.com/prod";

document.getElementById("reminderForm").onsubmit = async (event) => {
  event.preventDefault();
  const message = document.getElementById("message").value;
  const time = document.getElementById("time").value;

  // Convert time to ISO string
  const date = new Date(time);
  const isoString = date.toISOString();

  const body = {
    time: isoString,
    content: message,
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
};
