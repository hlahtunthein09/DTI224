const storageKey = 'members';
const memberNameInput = document.getElementById('member-name');
const memberList = document.getElementById('member-list');
const statusMessage = document.getElementById('status-message');

function getMembers() {
  try {
    const savedMembers = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(savedMembers) ? savedMembers : [];
  } catch {
    return [];
  }
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function DisplayMemberList() {
  const members = getMembers();
  memberList.replaceChildren();

  if (members.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty-state';
    emptyItem.textContent = 'No members saved yet.';
    memberList.appendChild(emptyItem);
    return;
  }

  members.forEach((member) => {
    const memberItem = document.createElement('li');
    memberItem.textContent = member;
    memberList.appendChild(memberItem);
  });
}

function AddMember() {
  const memberName = memberNameInput.value.trim();
  if (!memberName) {
    setStatus('Enter a member name before adding.');
    return;
  }

  const members = getMembers();
  members.push(memberName);
  localStorage.setItem(storageKey, JSON.stringify(members));
  memberNameInput.value = '';
  setStatus(`${memberName} was added.`);
  DisplayMemberList();
}

function RemoveMember() {
  const memberName = memberNameInput.value.trim();
  if (!memberName) {
    setStatus('Enter a member name before removing.');
    return;
  }

  const members = getMembers();
  const memberIndex = members.indexOf(memberName);
  if (memberIndex === -1) {
    setStatus(`${memberName} is not in the list.`);
    return;
  }

  members.splice(memberIndex, 1);
  localStorage.setItem(storageKey, JSON.stringify(members));
  memberNameInput.value = '';
  setStatus(`${memberName} was removed.`);
  DisplayMemberList();
}

document.getElementById('add-member').addEventListener('click', AddMember);
document.getElementById('remove-member').addEventListener('click', RemoveMember);
memberNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') AddMember();
});

DisplayMemberList();
