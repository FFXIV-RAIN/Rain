import {FlarieCommand} from '@flarie/core';
import endent from 'endent';
import {CONFIG} from '../config';
// import {modules} from '../modules';

export const InfoCommand = new FlarieCommand({
  name: 'info',
  allowDMs: true,
  description: 'Y-you want my number!?! >w<',
}, async (interaction) => {
  await interaction.reply({
    content: endent`
        **Environment:** ${CONFIG.ENVIRONMENT}
        **Version:** [${CONFIG.VERSION}](${CONFIG.VERSION_LINK})
    `,
    // content: endent`
    //     **Environment:** ${CONFIG.ENVIRONMENT}
    //     **Version: [${CONFIG.VERSION}](${CONFIG.VERSION_LINK})
    //     **Available Modules: ${modules.map((module) => module.name).join(', ')}
    // `,
    ephemeral: true
  });
});
