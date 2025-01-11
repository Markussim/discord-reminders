const testUsers = [
  { name: "Ant", discordId: "231711102931697665" },
  { name: "Mack", discordId: "292403753360031745" },
  { name: "Liss", discordId: "400691601011113986" },
  { name: "Svant", discordId: "225636267633803274" },
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
