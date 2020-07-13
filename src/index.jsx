import ForgeUI, {
  render,
  Fragment,
  Macro,
  Text,
  Image,
  Button,
  TextField,
  Form,
  Table,
  Head,
  Cell,
  Row,
  useState,
  useAction,
  StatusLozenge,
  useProductContext,
  AvatarStack,
  Avatar,
} from "@forge/ui";
import { useContentProperty } from "@forge/ui-confluence";
import api from "@forge/api";

/**  NOTE: Clean messy code later 😅😅 **/

const App = () => {
  const width = 250;
  const height = 250;

  const [oPos, setOPos] = useState([
    { x: 40, y: 40, opacity: 0 },
    { x: 120, y: 40, opacity: 0 },
    { x: 200, y: 40, opacity: 0 },
    { x: 40, y: 120, opacity: 0 },
    { x: 120, y: 120, opacity: 0 },
    { x: 200, y: 120, opacity: 0 },
    { x: 40, y: 200, opacity: 0 },
    { x: 120, y: 200, opacity: 0 },
    { x: 200, y: 200, opacity: 0 },
  ]);

  const [xPos, setXPos] = useState([
    {
      x1: 20,
      y1: 20,
      x2: 60,
      y2: 60,
      x12: 60,
      y12: 20,
      x22: 20,
      y22: 60,
      opacity: 0,
    },
    {
      x1: 140,
      y1: 20,
      x2: 100,
      y2: 60,
      x12: 100,
      y12: 20,
      x22: 140,
      y22: 60,
      opacity: 0,
    },
    {
      x1: 180,
      y1: 20,
      x2: 220,
      y2: 60,
      x12: 220,
      y12: 20,
      x22: 180,
      y22: 60,
      opacity: 0,
    },
    {
      x1: 20,
      y1: 140,
      x2: 60,
      y2: 100,
      x12: 60,
      y12: 140,
      x22: 20,
      y22: 100,
      opacity: 0,
    },
    {
      x1: 140,
      y1: 140,
      x2: 100,
      y2: 100,
      x12: 140,
      y12: 100,
      x22: 100,
      y22: 140,
      opacity: 0,
    },
    {
      x1: 180,
      y1: 140,
      x2: 220,
      y2: 100,
      x12: 180,
      y12: 100,
      x22: 220,
      y22: 140,
      opacity: 0,
    },
    {
      x1: 20,
      y1: 180,
      x2: 60,
      y2: 220,
      x12: 60,
      y12: 180,
      x22: 20,
      y22: 220,
      opacity: 0,
    },
    {
      x1: 140,
      y1: 180,
      x2: 100,
      y2: 220,
      x12: 100,
      y12: 180,
      x22: 140,
      y22: 220,
      opacity: 0,
    },
    {
      x1: 180,
      y1: 180,
      x2: 220,
      y2: 220,
      x12: 220,
      y12: 180,
      x22: 180,
      y22: 220,
      opacity: 0,
    },
  ]);

  const svg = `
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    height="${height}" 
    width="${width}">
    <g>
      <!-- draw grid lines -->
      <line x1="80" y1 ="5" x2="80" y2="245" style="stroke: #a4b5b8; stroke-width:2;" />
      <line x1="160" y1="5" x2="160" y2="245" style="stroke: #a4b5b8; stroke-width:2;" />
      <line x1="5" y1="80" x2="235" y2="80" style="stroke: #a4b5b8; stroke-width:2;"/>
      <line x1="5" y1="160" x2="235" y2="160" style="stroke: #a4b5b8; stroke-width:2"/>

      <!-- draw numbers -->
      <text x="35" y="45" fill="#b4bdc8" fill-opacity="0.5">0</text>
      <text x="115" y="45" fill="#b4bdc8" fill-opacity="0.5">1</text>
      <text x="185" y="45" fill="#b4bdc8" fill-opacity="0.5">2</text>

      <text x="35" y="125" fill="#b4bdc8" fill-opacity="0.5">3</text>
      <text x="115" y="125" fill="#b4bdc8" fill-opacity="0.5">4</text>
      <text x="185" y="125" fill="#b4bdc8" fill-opacity="0.5">5</text>

      <text x="35" y="210" fill="#b4bdc8" fill-opacity="0.5">6</text>
      <text x="115" y="210" fill="#b4bdc8" fill-opacity="0.5">7</text>
      <text x="185" y="210" fill="#b4bdc8" fill-opacity="0.5">8</text>


      <!-- draw O -->
      ${oPos.map(
        ({ x, y, opacity }) =>
          `<circle cx="${x}" cy="${y}" r="29" style="stroke: #39bbd4; stroke-width:5; fill: white; opacity: ${opacity};" />`
      )}

      <!-- draw X -->
      ${xPos.map(
        ({ x1, y1, x2, y2, x12, y12, x22, y22, opacity }) =>
          `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke: #398ad4; stroke-width:5; opacity: ${opacity};" />
          <line x1="${x12}" y1="${y12}" x2="${x22}" y2="${y22}" style="stroke: #398ad4; stroke-width:5; opacity: ${opacity};" />`
      )}
    </g>
  </svg>
`;

  const [moves, setMoves] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [players, setPlayers] = useState([]);
  const [isGame, setGame] = useState(false);
  const [submitted, setSubmitted] = useAction((_, formData) => {
    setIsXNext(!isXNext);
    let m = [...moves];
    if (isXNext) {
      m[formData.move] = "X";
      let newArr = [...xPos];
      newArr[formData.move].opacity = 1;
      setXPos(newArr);
    } else {
      m[formData.move] = "O";
      let newArr = [...oPos];
      newArr[formData.move].opacity = 1;
      setOPos(newArr);
    }
    setMoves(m);
  }, undefined);

  const { accountId } = useProductContext();

  return (
    <Fragment>
      <Table>
        <Row>
          <Cell>
            <Image
              src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
              alt="game"
            />
          </Cell>
          <Cell>
            {isGame ? (
              <Fragment>
                <AvatarStack>
                  {players.map(({ id }) => (
                    <Avatar accountId={id} />
                  ))}
                </AvatarStack>
                <Text>{calculateWinner(moves, isXNext)}</Text>
                <Form onSubmit={setSubmitted}>
                  <TextField label="Enter square number" name="move" />
                </Form>
              </Fragment>
            ) : (
              <Button
                text="Start Game 🎲"
                onClick={async () => {
                  const data = await (
                    await api.asUser().requestJira("/rest/api/3/myself")
                  ).json();
                  let newState = [
                    ...players,
                    { name: data.displayName, id: accountId },
                  ];
                  setPlayers(newState);
                  console.log(players);
                  setGame(true);
                }}
              />
            )}
          </Cell>
        </Row>
      </Table>
    </Fragment>
  );
};

function calculateWinner(moves, isXNext) {
  const possibleLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < possibleLines.length; i++) {
    const [a, b, c] = possibleLines[i];
    if (moves[a] && moves[a] === moves[b] && moves[a] === moves[c]) {
      let Winner = moves[a];
      if (Winner) {
        return "Winner: " + Winner;
      } else if (isBoardFull(moves)) {
        return "Draw!";
      }
    }
  }
  return "Next player: " + (isXNext ? "X" : "O");
}

function isBoardFull(moves) {
  for (let i = 0; i < moves.length; i++) {
    if (moves[i] == null) {
      return false;
    }
  }
  return true;
}

export const run = render(<Macro app={<App />} />);
