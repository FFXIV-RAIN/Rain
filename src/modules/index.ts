import {IModule} from '../@rain/bot/@types/module';
import {WelcomeModule} from './WelcomeModule';
import {AutoRoleModule} from './AutoRoleModule';
import {ScheduledMessagesModule} from './ScheduledMessagesModule';

export const modules: IModule[] = [
    new WelcomeModule(),
    new AutoRoleModule(),
    new ScheduledMessagesModule(),
];