"use strict";

import { Player } from "./Player";

let player: Player;

window.addEventListener("load", function() {
   player = new Player("kb");
});