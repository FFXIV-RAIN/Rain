import {IModule} from '../@types/module';
import {WelcomeModule} from './welcome.module';
import {AutoRoleModule} from './auto-role.module';
import {ScheduledMessagesModule} from './scheduled-messages.module';

export const modules: IModule[] = [
    new WelcomeModule(),
    new AutoRoleModule(),
    new ScheduledMessagesModule(),
];