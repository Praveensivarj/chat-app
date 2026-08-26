const { User } = require('./dist/src/models/user.model.js');
const { shapeLoginUser } = require('./dist/src/resources/user.resource.js');

async function test() {
    const user = User.build({
        unique_id: 'U-0001',
        email: 'test@example.com',
        status: 'active'
    });

    const shaped = shapeLoginUser(user);
    console.log(JSON.stringify(shaped, null, 2));
}

test();
