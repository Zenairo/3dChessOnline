# 3dChessOnline
node.js socket.io three.js multi-board 3d chess multiplayer online

Developed in WebStorm

Simple server and client world setup to play 3d chess with multiple boards (1-8)

Demo available at: https://salty-peak-7906.herokuapp.com/

Notes:



First user to join is assigned white.

Second user to join is assigned black.

Subsequent users are assigned spectator.

A game will reset if BOTH white and black users are disconnected (close the page).

If only white or only black disconnects, the next user to join will be assigned that color.

TODO:

Set up a main chat lobby for matchmaking, instantiate game sessions, and build a chat component into game page.
