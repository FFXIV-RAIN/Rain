import {WelcomeModule} from './WelcomeModule';
import {AutoRoleModule} from './AutoRoleModule';
import {scheduledMessagesModule} from './ScheduledMessagesModule';
import {reminderModule} from './ReminderModule';

export const modules: IModule[] = [
    new WelcomeModule(),
    new AutoRoleModule(),
    scheduledMessagesModule,
    reminderModule,
];
