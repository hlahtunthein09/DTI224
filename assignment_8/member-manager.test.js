const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class FakeElement {
  constructor() {
    this.value = '';
    this.textContent = '';
    this.children = [];
    this.className = '';
  }

  appendChild(child) {
    this.children.push(child);
  }

  replaceChildren(...children) {
    this.children = children;
  }

  addEventListener() {}
}

function loadMemberManager(initialMembers = []) {
  const elements = {
    'member-name': new FakeElement(),
    'member-list': new FakeElement(),
    'status-message': new FakeElement(),
    'add-member': new FakeElement(),
    'remove-member': new FakeElement()
  };
  const storage = new Map([['members', JSON.stringify(initialMembers)]]);
  const document = {
    getElementById(id) {
      return elements[id];
    },
    createElement() {
      return new FakeElement();
    }
  };
  const localStorage = {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, value);
    }
  };
  const source = fs.readFileSync('assignment_8/script.js', 'utf8');
  const context = { document, localStorage };

  vm.createContext(context);
  vm.runInContext(source, context);
  return { context, elements, storage };
}

{
  const { context, elements, storage } = loadMemberManager();
  elements['member-name'].value = 'Aye Aye';
  context.AddMember();

  assert.deepEqual(JSON.parse(storage.get('members')), ['Aye Aye']);
  assert.equal(elements['member-list'].children.length, 1);
  assert.equal(elements['member-list'].children[0].textContent, 'Aye Aye');
}

{
  const { context, elements, storage } = loadMemberManager(['Aye Aye', 'Min Min']);
  elements['member-name'].value = 'Aye Aye';
  context.RemoveMember();

  assert.deepEqual(JSON.parse(storage.get('members')), ['Min Min']);
  assert.equal(elements['member-list'].children.length, 1);
  assert.equal(elements['member-list'].children[0].textContent, 'Min Min');
}

console.log('Member manager tests passed.');
