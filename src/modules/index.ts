import {IModule} from '../../types/module';
import {WelcomeModule} from './welcome.module';
import {AutoRoleModule} from './auto-role.module';

export const modules: IModule[] = [
    new WelcomeModule(),
    new AutoRoleModule(),
];