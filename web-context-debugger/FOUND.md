# Found and identified list of properties

| Key        | Type                     | Description                                           |
| ---------- | ------------------------ | ----------------------------------------------------- |
| cvid       | string                   | Current video. Shows where Maya is standing at        |
| guesrooms  | number[]                 | Array of rooms where Maya's friends located           |
| guestsin   | (0 \| 1)[]               | Array of 0's and 1's indicating where friends are     |
| colour     | number                   | Saturation regulated by O/P ingame                    |
| csX, csY   | number                   | Probably compass location                             |
| floor      | number                   | 0, 1, 2, 3, 4                                         |
| jimp       | ??                       |                                                       |
| progress   | number                   | Story progress from 0 to 100                          |
| ButOneLink | string                   | Name of action on button 1                            |
| ButTwoLink | string                   | Name of action on button 2                            |
| npos       | [number, number]         | Something related to Maya's rotation and position     |
| inroom     | number                   | Number of room you're in or 0                         |
| hide       | number                   | 0 = not hiding, 1 = bathroom, 2 = wardrobe            |
| searchon   | number                   | 0 or 1 indicating whether you're searching right now  |
| jmop       | [string, string]         | Array like `["6016","W"]` indicating Jimmy's position |
| pos        | [number, number, string] | Array like `[60,16,"W"]` indicating Maya's position   |
| jhfloor    | number                   | Floor on which Jimmy at (from 0 to 4)                 |
| jhinroom   | number                   | Room number in which Jimmy is                         |
| menon      | 0 \| 1                   | Is menu visible                                       |
| stairs     | 0 \| 2                   | Is Maya on stairs                                     |
|            |                          |                                                       |

## Positions

You can find all mapped positions (like "6016") in [cheats repository](https://github.com/AtDeadOfNight/cheats/)

Directions:
N - backward (looking at the elevators, bottom side of the map)
E — left (lookng to the right side of elevators, left side of the map)
W — right (looking to the left side of elevators, right side of the map)
S — forward (looking at the stairs, top side of the map)

## Cvids

| Cvid                                | Description                                                |
| ----------------------------------- | ---------------------------------------------------------- |
| F3-LIFT-EXIT, 6220-EL               | Этаж 3. Майя смотрит на лифты                              |
| 6220-NR                             | Этаж 3. Майя около лифтов. Смотрит направо от них.         |
| 6220-NL                             | Этаж 3. Майя около лифтов. Смотрит налево от них.          |
| 6120-6119                           | Этаж 3. Майя в туалете                                     |
| 6120-ER                             | Этаж 3. Майя смотрит на лестницу.                          |
| 6120-SL                             | Этаж 3. Майя около лестницы. Смотрит на комнату с лифтами. |
| 6120-EL                             | Этаж 3. Майя около лестницы. Смотрит на туалет.            |
| 6120-SR                             | Этаж 3. Майя около лестницы. Смотрит на корридор.          |
| F3-LIFT-ENTER, F3-LIFT-L, F3-LIFT-R | Этаж 3. Майя в лифте                                       |