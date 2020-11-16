const fsPromises = require('fs').promises;
const path = require('path');

const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, './db/contacts.json');

function getContactsFromFile() {
  return fsPromises
    .readFile(contactsPath, 'utf-8')
    .then(contacts => JSON.parse(contacts))
    .catch(error => console.log(error.message));
}

function listContacts() {
  getContactsFromFile().then(data => console.table(data));
}

function getContactById(contactId) {
  getContactsFromFile().then(contacts => {
    const contactById = contacts.find(contact => contact.id === contactId);
    const contact = contactById || 'No contacts found for the specified id.';
    console.log(contact);
  });
}

function removeContact(contactId) {
  getContactsFromFile().then(contacts => {
    const contactInDB = contacts.some(contact => contact.id === contactId);
    if (!contactInDB) {
      console.log('No contacts found for the specified id.');
      return;
    }

    const clearedContacts = contacts.filter(
      contact => contact.id !== contactId,
    );

    const contactsToStr = JSON.stringify(clearedContacts, null, 2);

    fsPromises
      .writeFile(contactsPath, contactsToStr, 'utf-8')
      .catch(error => console.log(error.message));

    console.log('done');
  });
}

function addContact(name, email, phone) {
  const id = uuidv4();
  const contact = {
    id,
    name,
    email,
    phone,
  };

  getContactsFromFile().then(contacts => {
    const newContacts = [...contacts, contact];
    const newContactsStr = JSON.stringify(newContacts, null, 2);

    fsPromises
      .writeFile(contactsPath, newContactsStr, 'utf-8')
      .catch(error => console.log(error.message));

    console.log('done');
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
