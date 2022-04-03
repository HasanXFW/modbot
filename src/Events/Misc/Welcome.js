const {GuildMember, MessageEmbed} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const PenalManager = require("../../Managers/PenalManager");

/**
 * 
 * @param {GuildMember} member 
 */
module.exports = async (member) => {
    let channel = member.guild.channels.cache.get(Settings.Welcome.Channel);
    if(member.user.bot){
        if(channel) channel.csend(`${member} bir bot.`);
        return;
    }

    let penals = await PenalManager.getPenals({User: member.id});

    let jail = penals.some(e => e.Type == PenalManager.Types.JAIL || e.Type == PenalManager.Types.TEMP_JAIL);
    if(jail){
        PenalManager.setRoles(member, Settings.Penals.Jail.Role);
        if(channel) channel.csend(`${member} kişisi sunucuya katıldı ve aktif bir jail kaydı bulundu ve jail'e atıldı.`);
        return;
    }
    let giveRoles = Settings.Roles.Unregistered;
    let mute = penals.some(e => e.Type == PenalManager.Types.MUTE || e.Type == PenalManager.Types.TEMP_MUTE);
    if(mute) giveRoles.concat(Settings.Penals.Mute.Role);
    let voiceMute = penals.some(e => e.Type == PenalManager.Types.VOICE_MUTE || e.Type == PenalManager.Types.TEMP_VOICE_MUTE);
    if(voiceMute && Settings.Penals.VoiceMute.Role.length > 0) giveRoles.concat(Settings.Penals.VoiceMute.Role);
    if(giveRoles.length > 0) member.setRoles(giveRoles);


}

module.exports.config = {
    Event: "guildMemberAdd"
}