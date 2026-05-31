import { World, Entity } from "../../engine/types";
import { randColor } from "../../engine/color";

// Transcribed from add_big_fish_1 and add_big_fish_2 in aq.pl
// ? = transparent char; W = white in mask (eye); digits = randColor slots
// addBigFish randomly picks variant 1 or 2 per call

// ─── Big Fish 1 ──────────────────────────────────────────────────────────────

const BIG_FISH1_RIGHT_FRAME =
  " ______\n" +
  "`\"\"--.  `````-----.....__\n" +
  "     `.  .      .       `-.\n" +
  "       :     .     .       `.\n" +
  " ,?????:   .    .          _ :\n" +
  ": `.???:                  (@) `._\n" +
  " `. `..'     .     =`-.       .__)  \n" +
  "   ;     .        =  ~  :     .-\"\n" +
  " .' .'`.   .    .  =.-'  `._ .'\n" +
  ": .'???:               .   .'\n" +
  " '???.'  .    .     .   .-'\n" +
  "   .'____....----''.'=.'\n" +
  "   \"\"?????????????.'.'  \n" +
  "               ''\"'`";

const BIG_FISH1_LEFT_FRAME =
  "                           ______\n" +
  "          __.....-----'''''  .-\"\"\"\n" +
  "       .-'       .      .  .'\n" +
  "     .'       .     .     :\n" +
  "    : _          .    .   :?????,\n" +
  " _.' (@)                  :???.' :\n" +
  "(__       .-'=     .     `..' .'\n" +
  " \"-.     :  ~  =        .     ;\n" +
  "   `. _.'  `-.=  .    .   .'`. `.\n" +
  "     `.   .               :???`. :\n" +
  "       `-.   .     .    .  `.???\`\n" +
  "          `.=`.``----....____`.\n" +
  "            `.`.?????????????\"\" \n" +
  "              '`\"``";

const BIG_FISH1_RIGHT_MASK =
  " 111111\n" +
  "11111  11111111111111111\n" +
  "     11  2      2       111\n" +
  "       1     2     2       11\n" +
  " 1     1   2    2          1 1\n" +
  "1 11   1                  1W1 111\n" +
  " 11 1111     2     1111       1111\n" +
  "   1     2        1  1  1     111\n" +
  " 11 1111   2    2  1111  111 11\n" +
  "1 11   1               2   11\n" +
  " 1   11  2    2     2   111\n" +
  "   111111111111111111111\n" +
  "   11             1111\n" +
  "               11111";

const BIG_FISH1_LEFT_MASK =
  "                           111111\n" +
  "          11111111111111111  11111\n" +
  "       111       2      2  11\n" +
  "     11       2     2     1\n" +
  "    1 1          2    2   1     1\n" +
  " 111 1W1                  1   11 1\n" +
  "1111       1111     2     1111 11\n" +
  " 111     1  1  1        2     1\n" +
  "   11 111  1111  2    2   1111 11\n" +
  "     11   2               1   11 1\n" +
  "       111   2     2    2  11   1\n" +
  "          111111111111111111111\n" +
  "            1111             11\n" +
  "              11111";

// ─── Big Fish 2 ──────────────────────────────────────────────────────────────

const BIG_FISH2_RIGHT_FRAME =
  "                _ _ _\n" +
  "             .='\\ \\ \\`\"=,\n" +
  "           .'\\ \\ \\ \\ \\ \\ \\\n" +
  "\\\'=._?????/ \\ \\ \\_\\_\\_\\_\\_\\\n" +
  "\\\'=._\'.??/\\ \\,-\"`- _ - _ - \'-.\n" +
  "  \\`=._\\|\'.\\/- _ - _ - _ - _- \\\n" +
  "  ;\"= ._\\=./_ -_ -_ {`\"=_    @ \\\n" +
  "   ;\"=_-_=- _ -  _ - {\"=_\"-     \\\n" +
  "   ;_=_--_.,          {_.=\'   .-/\n" +
  "  ;.=\"` / \';\\        _.     _.-`\n" +
  "  /_.=\'/ \\/ /;._ _ _{.-;`/\"`\n" +
  "/._=_.\'???\'/ / / / /{.= /\n" +
  "/.=\' ??????`\'./_/_.=`{_/";

const BIG_FISH2_LEFT_FRAME =
  "            _ _ _\n" +
  "        ,=\"`/ / /\'=.\n" +
  "       / / / / / / /\'.\n" +
  "      /_/_/_/_/_/ / / \\?????_.=\'/\n" +
  "   .-\' - _ - _ -`\"-,/ /\\??\'._.=\'/\n" +
  "  / -_ - _ - _ - _ -\\/.|/_.=`/\n" +
  " / @    _=\"`} _- _- _\\.=/_. =\";\n" +
  "/     -\"_=\"} - _  - _ -=_-_\"=;\n" +
  "\\-.   \'=._}          ,._--_=_;\n" +
  " `-._     ._        /;\' \\ `\"=.;\n" +
  "     `\"\\`;-.}_ _ _.;\\ \\/ \\\'=._\\\n" +
  "        \\ =.}\\ \\ \\ \\ \\'???\'._=_.\\\n" +
  "         \\_}`=._\\_\\.\\'???????\'=.\\";

const BIG_FISH2_RIGHT_MASK =
  "                1 1 1\n" +
  "             1111 1 11111\n" +
  "           111 1 1 1 1 1 1\n" +
  "11111     1 1 1 11111111111\n" +
  "1111111  11 111112 2 2 2 2 111\n" +
  "  111111111112 2 2 2 2 2 2 22 1\n" +
  "  111 1111 12 22 22 11111    W 1\n" +
  "   11111112 2 2  2 2 111111     1\n" +
  "   111111111          11111   111\n" +
  "  11111 11111        11     1111\n" +
  "  111111 11 1111 1 111111111\n" +
  "1111111   11 1 1 1 1111 1\n" +
  "1111       1111111111111";

const BIG_FISH2_LEFT_MASK =
  "            1 1 1\n" +
  "        11111 1 1111\n" +
  "       1 1 1 1 1 1 111\n" +
  "      11111111111 1 1 1     11111\n" +
  "   111 2 2 2 2 211111 11  1111111\n" +
  "  1 22 2 2 2 2 2 2 211111111111\n" +
  " 1 W    11111 22 22 2111111 111\n" +
  "1     111111 2 2  2 2 21111111\n" +
  "111   11111          111111111\n" +
  " 1111     11        111 1 11111\n" +
  "     111111111 1 1111 11 111111\n" +
  "        1 1111 1 1 1 11   1111111\n" +
  "         1111111111111       1111";

export function addBigFish(world: World, rng: () => number = Math.random): Entity {
  const goRight = rng() < 0.5;
  const variant = rng() < 0.5 ? 1 : 2;
  const speed = variant === 1 ? 3 : 2.5;

  let frame: string;
  let maskTemplate: string;
  let frameWidth: number;

  if (variant === 1) {
    frame = goRight ? BIG_FISH1_RIGHT_FRAME : BIG_FISH1_LEFT_FRAME;
    maskTemplate = goRight ? BIG_FISH1_RIGHT_MASK : BIG_FISH1_LEFT_MASK;
    frameWidth = 34;
  } else {
    frame = goRight ? BIG_FISH2_RIGHT_FRAME : BIG_FISH2_LEFT_FRAME;
    maskTemplate = goRight ? BIG_FISH2_RIGHT_MASK : BIG_FISH2_LEFT_MASK;
    frameWidth = 33;
  }

  const colorMask = randColor(maskTemplate, rng);
  const x = goRight ? -frameWidth : world.width;

  const maxHeight = 9;
  const minHeight = world.height - (variant === 1 ? 15 : 14);
  const y = Math.floor(rng() * Math.max(1, minHeight - maxHeight)) + maxHeight;

  return world.add({
    name: "bigFish",
    type: "event",
    x,
    y,
    z: 5,
    defaultColor: "Y",
    dieOffscreen: true,
    shape: {
      frames: [frame],
      masks: [colorMask],
    },
    callback: (_e, dt) => ({ dx: (goRight ? 1 : -1) * speed * dt * 8 }),
  });
}
