const markerType = 1; // тип маркера
const markerSize = 1; // размер маркера
const markerColor = [255, 0, 0, 100]; // цвет маркера
const blipType = 468; // тип иконки на радаре

let markerCoords = { "x": 1991.902587890625, "y": 3055.414306640625, "z": 46.21493148803711 };
const antennasLocations = [
    { x: 2142.70751953125, y: 2907.436279296875, z: 49.768211364746094 },
    { x: 2111.176025390625, y: 2931.046630859375, z: 49.93205642700195 },
    { x: 2078.72021484375, y: 2954.41357421875, z: 48.92182159423828 },
    { x: 2041.386474609375, y: 2949.57275390625, z: 50.022186279296875 },
    { x: 2003.4085693359375, y: 2938.572265625, z: 49.47568893432617 },
    { x: 1967.979248046875, y: 2925.853271484375, z: 48.673240661621094 },
];

const startPosition = { x: 2050.3515625, y: 2915.872314453125, z: 48.255245208740234 };

let newPos = false;
let counter = 0;

const localPlayer = mp.players.local;

let workMarker = false;
let workMarkerColshape = false;
let workBlip = false;

let money = 0;

let AntennaPos = false;
let antMarker = false;
let antColshape = false;
let antBlip = false;

let missionStatus = 1;

mp.events.add('stopWorking', () => {
    mp.gui.chat.push(`Работа завершена! Заработано: ${money}$.`);
    localPlayer.position = { "x": 1981.7193603515625, "y": 3072.9560546875, "z": 46.960052490234375 };
    localPlayer.model = oldModel;
    workMarker = mp.markers.new(markerType, markerCoords, markerSize, { color: markerColor });
    workMarkerColshape = mp.colshapes.newSphere(markerCoords.x, markerCoords.y, markerCoords.z, 2);
    workBlip = mp.blips.new(blipType, markerCoords, {shortRange: false, name: "Настройка антенн"});
    counter = 0;
    money = 0;
})

mp.events.add('createWorkMarker', () => {
    workMarker = mp.markers.new(markerType, markerCoords, markerSize, { color: markerColor });
    mp.game.graphics.drawText("Начать работу дальнобойщика", [markerCoords.x, markerCoords.y, markerCoords.z + 1], {
        font: 7, 
        color: [255, 255, 255, 185], 
        scale: [1.2, 1.2], 
        outline: true,
        centre: true
      });
    workMarkerColshape = mp.colshapes.newSphere(markerCoords.x, markerCoords.y, markerCoords.z, 2);
    workBlip = mp.blips.new(blipType, markerCoords, {shortRange: false, name: "Настройка антенн"});
});

mp.events.add('playerEnterColshape', (shape) => {
    if (checkColshape(shape)) {
        mp.gui.chat.push("Вы начали работу по ремонту антенн!");
        mp.gui.chat.push("Отказаться от работы можно, введя команду /stopjob");
        workMarker.destroy();
        workMarkerColshape.destroy();
        workBlip.destroy();
        setTimeout(() => {
            localPlayer.model = mp.game.joaat('csb_trafficwarden');
        }, 1500);
        oldModel = localPlayer.model;
        localPlayer.position = startPosition;
        AntennaPos = pickLocation(antennasLocations);
        do {
            newPos = pickLocation(antennasLocations)
        } while(AntennaPos == newPos);
        antMarker = mp.markers.new(markerType, AntennaPos, markerSize, { color: markerColor });
        antColshape = mp.colshapes.newSphere(AntennaPos.x, AntennaPos.y, AntennaPos.z, 2);
        antBlip = mp.blips.new(blipType, AntennaPos, {shortRange: false, name: "Антенна"});
    };
    if (!checkColshape(shape)) {
        mp.events.callRemote('playAnim');
        counter += 1;
        setTimeout(() => {
            mp.gui.chat.push(`+1 отремонтированная антенна! Всего: ${counter} выполнено.`);
            money += 100;
            mp.gui.chat.push(`Денег заработано: ${money}$.`)
            antColshape.destroy();
            antMarker.destroy();
            antBlip.destroy();
            AntennaPos = newPos;
            antMarker = mp.markers.new(markerType, AntennaPos, markerSize, { color: markerColor });
            antColshape = mp.colshapes.newSphere(AntennaPos.x, AntennaPos.y, AntennaPos.z, 2);
            antBlip = mp.blips.new(blipType, AntennaPos, {shortRange: false, name: "Антенна"}); 
        }, 3000);
        do {
            newPos = pickLocation(antennasLocations)
        } while(AntennaPos == newPos);
        }
});

function pickLocation(antennasLocations) {
    return antennasLocations[Math.floor(Math.random() * antennasLocations.length)];
}

function checkColshape(colshape) {
    if (colshape == workMarkerColshape) {
        return true;
    };
    return false;
}
