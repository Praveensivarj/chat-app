import { User } from './src/models/user.model';
import { shapeLoginUser } from './src/resources/user.resource';

async function test() {
    const user = User.build({
        unique_id: 'U-0001',
        email: 'test@example.com',
        status: 'active'
    });

    const shaped = shapeLoginUser(user);
    console.log("SHAPED:", JSON.stringify(shaped, null, 2));
}

test();
