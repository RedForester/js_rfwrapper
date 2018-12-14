import { Wrapper } from '../../src';

const rf = new Wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

const map = {  
    name:'123',
    accessed:'',
    layout:'LR',
    node_count:5,
    user_count:4,
    objid:'',
    owner:'94d43ed4-d05e-45df-9e5d-c9d1ba1c369b',
    owner_avatar:'https://ru.gravatar.com/userimage/85982417/2947fe117cf09d53ad6e3e2a36719163.png?size=200',
    owner_name:'kudryavtsev@nppsatek.ru',
    public:false,
    role:{  
        role:'user_rwh',
        editable:true,
        description:'Пользователь, чтение, запись и редактирование связей',
        alias:null
    },
    root_node_id:'1cc444ba-8dfc-44a2-9118-d2a2983735b8',
    users:[],
    id:'2b0fb3c2-20f0-4944-8bf1-9dac372a52e9',
};

test('Should load Map by uuid', async () => {
    const result = await rf.Map(map.id);
    
    expect(result.id).toEqual(map.id);
    expect(result.name).toEqual(map.name);
    expect(result.layout).toEqual(map.layout);
    expect(result.owner).toEqual(map.owner);
    expect(result.owner_name).toEqual(map.owner_name);
});