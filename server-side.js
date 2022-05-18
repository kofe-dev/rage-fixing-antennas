mp.events.add("playerReady", player => {
    player.call('createWorkMarker');
    let isWorking = true;
});

mp.events.addCommand('stopjob', (player) => {
    player.spawn({ "x": 1981.7193603515625, "y": 3072.9560546875, "z": 46.960052490234375 });
    player.call('stopWorking');
});

mp.events.add('playAnim', player => {
    player.playAnimation('amb@code_human_cower_stand@male@react_cowering', 'base_right', 1, 49);
    setTimeout(() => {
        player.stopAnimation();
    }, 3500);
});
