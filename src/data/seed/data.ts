import { bcryptAdapter } from '../../config/plugins';

export const seedData = {
  users: [
    {id:'1', name: 'User 1', email: 'test1@gmail.com', password: bcryptAdapter.hash( '123456'), emailValidated: true},
    {id:'2', name: 'User 2', email: 'test2@gmail.com', password: bcryptAdapter.hash( '123456'), emailValidated: true },
    {id:'3', name: 'User 3', email: 'test3@gmail.com', password: bcryptAdapter.hash( '123456'), emailValidated: true },
    {id:'4', name: 'User 4', email: 'test4@gmail.com', password: bcryptAdapter.hash( '123456') },
    {id:'5', name: 'User 5', email: 'test5@gmail.com', password: bcryptAdapter.hash( '123456') },
    {id:'6', name: 'User 6', email: 'test6@gmail.com', password: bcryptAdapter.hash( '123456') },
  ],

  lists: [
    {id:'1', userId: '1', name: 'List 1' },
    {id:'2', userId: '1', name: 'List 2' },
    {id:'3', userId: '2', name: 'List 3' },
    {id:'4', userId: '3', name: 'List 4' },
    {id:'5', userId: '4', name: 'List 5' },
    {id:'6', userId: '5', name: 'List 6' },
    {id:'7', userId: '6', name: 'List 7' },
    {id:'8', userId: '1', name: 'List 8' },
    {id:'9', userId: '2', name: 'List 9' },
    {id:'10', userId: '3', name: 'List 10'},
  ],

  items: [
    {id:'1', listId: '1', description: 'Item 1', isActivated: true },
    {id:'2', listId: '1', description: 'Item 2', isActivated: false },
    {id:'3', listId: '1', description: 'Item 3', isActivated: true },
    {id:'4', listId: '2', description: 'Item 4', isActivated: false },
    {id:'5', listId: '2', description: 'Item 5', isActivated: true },
    {id:'6', listId: '3', description: 'Item 6', isActivated: false },
    {id:'7', listId: '3', description: 'Item 7', isActivated: true },
    {id:'8', listId: '4', description: 'Item 8', isActivated: false },
    {id:'9', listId: '4', description: 'Item 9', isActivated: true },
    {id:'10', listId: '5', description: 'Item 10', isActivated: false },
    {id:'11', listId: '5', description: 'Item 11', isActivated: true },
    {id:'12', listId: '6', description: 'Item 12', isActivated: false},
    {id:'13', listId: '6', description: 'Item 13', isActivated: true},
    {id:'14', listId: '7', description: 'Item 14', isActivated: false},
    {id:'15', listId: '7', description: 'Item 15', isActivated: true},
    {id:'16', listId: '8', description: 'Item 16', isActivated: true},
    {id:'17', listId: '8', description: 'Item 17', isActivated: false},
    {id:'18', listId: '9', description: 'Item 18', isActivated: true},
    {id:'19', listId: '9', description: 'Item 19', isActivated: false},
    {id:'20', listId: '10', description: 'Item 20', isActivated: true}
  ]
}