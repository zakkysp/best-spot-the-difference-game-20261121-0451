// Difference data for the three levels.
//
// A difference is an object with:
//   label - short name shown when it is found
//   x, y  - centre in the 600 x 540 scene space
//   r     - click radius (a little generous, so a fair click counts)
//   draw  - draws the differing element for one panel side.
//           side 'A' is the left picture, 'B' is the right picture.
// The base scene (scenes.js) draws everything the two panels share;
// a difference draws ONLY the thing that changes between the panels.

// ---------- helpers shared by the difference drawings ----------

function flag(ctx, x, y, colour) {
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 26);
  ctx.stroke();
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x, y - 26);
  ctx.lineTo(x + 24, y - 19);
  ctx.lineTo(x, y - 12);
  ctx.closePath();
  ctx.fill();
}

function sittingCat(ctx, x, y, colour) {
  ctx.fillStyle = colour;
  // body
  ctx.beginPath();
  ctx.ellipse(x, y, 13, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  // head
  ctx.beginPath();
  ctx.arc(x, y - 20, 10, 0, Math.PI * 2);
  ctx.fill();
  // ears
  ctx.beginPath();
  ctx.moveTo(x - 8, y - 27);
  ctx.lineTo(x - 5, y - 36);
  ctx.lineTo(x - 1, y - 28);
  ctx.closePath();
  ctx.moveTo(x + 8, y - 27);
  ctx.lineTo(x + 5, y - 36);
  ctx.lineTo(x + 1, y - 28);
  ctx.closePath();
  ctx.fill();
  // tail curl
  ctx.strokeStyle = colour;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x + 14, y + 8, 8, Math.PI * 0.9, Math.PI * 1.9);
  ctx.stroke();
}

function balloon(ctx, x, y) {
  ctx.strokeStyle = '#7a6a55';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + 26);
  ctx.lineTo(x, y + 44);
  ctx.stroke();
  ctx.fillStyle = '#e2574c';
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.ellipse(x - 5, y - 7, 4, 7, -0.4, 0, Math.PI * 2);
  ctx.fill();
}

// ---------- Level 1: Harbor Morning ----------

const harborDifferences = [
  {
    id: 'flag',
    label: 'Lighthouse flag',
    x: 512, y: 66, r: 30,
    draw(ctx, side) { flag(ctx, 500, 96, side === 'A' ? '#d23b2e' : '#f2c230'); },
  },
  {
    id: 'cat',
    label: 'Cat on the pier',
    x: 300, y: 388, r: 30,
    draw(ctx, side) { if (side === 'A') sittingCat(ctx, 300, 388, '#3d3d3d'); },
  },
  {
    id: 'sail',
    label: 'Boat sail',
    x: 150, y: 372, r: 34,
    draw(ctx, side) {
      ctx.strokeStyle = '#6b4a2f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(150, 330);
      ctx.lineTo(150, 400);
      ctx.stroke();
      if (side === 'A') {
        ctx.fillStyle = '#fdf6e3';
        ctx.beginPath();
        ctx.moveTo(150, 334);
        ctx.lineTo(150, 396);
        ctx.lineTo(196, 396);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = '#d23b2e';
        ctx.beginPath();
        ctx.moveTo(150, 334);
        ctx.lineTo(150, 396);
        ctx.lineTo(196, 396);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fdf6e3';
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(152, 346 + i * 18, 34 - i * 8, 7);
        }
      }
    },
  },
  {
    id: 'window',
    label: 'Lit window',
    x: 92, y: 202, r: 26,
    draw(ctx, side) {
      ctx.fillStyle = side === 'A' ? '#ffd94d' : '#2e3d52';
      ctx.fillRect(80, 190, 24, 24);
      ctx.strokeStyle = '#5a4632';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 190, 24, 24);
      ctx.beginPath();
      ctx.moveTo(92, 190);
      ctx.lineTo(92, 214);
      ctx.moveTo(80, 202);
      ctx.lineTo(104, 202);
      ctx.stroke();
    },
  },
  {
    id: 'balloon',
    label: 'Red balloon',
    x: 428, y: 108, r: 30,
    draw(ctx, side) { if (side === 'A') balloon(ctx, 428, 108); },
  },
  {
    id: 'gull',
    label: 'Third gull',
    x: 252, y: 92, r: 26,
    draw(ctx, side) {
      if (side !== 'A') return;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(240, 92);
      ctx.quadraticCurveTo(246, 84, 252, 92);
      ctx.quadraticCurveTo(258, 84, 264, 92);
      ctx.stroke();
    },
  },
  {
    id: 'buoy',
    label: 'Red buoy',
    x: 480, y: 468, r: 28,
    draw(ctx, side) {
      if (side !== 'A') return;
      ctx.fillStyle = '#d23b2e';
      ctx.beginPath();
      ctx.arc(480, 468, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fdf6e3';
      ctx.fillRect(472, 462, 16, 5);
      ctx.fillStyle = '#8a2b20';
      ctx.fillRect(477, 452, 6, 6);
    },
  },
];

// ---------- Level 2: Night Market ----------

const marketDifferences = [
  {
    id: 'lantern',
    label: 'Lantern colour',
    x: 200, y: 122, r: 30,
    draw(ctx, side) {
      const colour = side === 'A' ? '#e23b2e' : '#3fae5a';
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.ellipse(200, 122, 15, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd94d';
      ctx.beginPath();
      ctx.ellipse(200, 122, 6, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2b2b2b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(200, 103);
      ctx.lineTo(200, 96);
      ctx.stroke();
    },
  },
  {
    id: 'sign',
    label: 'Sign letter',
    x: 330, y: 252, r: 30,
    draw(ctx, side) {
      ctx.fillStyle = '#f7ead0';
      ctx.fillRect(282, 238, 96, 28);
      ctx.strokeStyle = '#7a4a21';
      ctx.lineWidth = 2;
      ctx.strokeRect(282, 238, 96, 28);
      ctx.fillStyle = '#7a2b1d';
      ctx.font = 'bold 17px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(side === 'A' ? 'RAMEN' : 'RANEN', 330, 253);
    },
  },
  {
    id: 'cat',
    label: 'Cat on the crate',
    x: 482, y: 430, r: 30,
    draw(ctx, side) { if (side === 'A') sittingCat(ctx, 482, 430, '#e8e0d0'); },
  },
  {
    id: 'moon',
    label: 'The moon',
    x: 520, y: 66, r: 32,
    draw(ctx, side) {
      if (side === 'A') {
        ctx.fillStyle = '#f6ead0';
        ctx.beginPath();
        ctx.arc(520, 66, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e3d3ae';
        for (const [cx, cy, cr] of [[512, 60, 5], [528, 74, 4]]) {
          ctx.beginPath();
          ctx.arc(cx, cy, cr, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = '#f6ead0';
        ctx.beginPath();
        ctx.arc(520, 66, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#141a33';
        ctx.beginPath();
        ctx.arc(530, 60, 21, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  {
    id: 'awning',
    label: 'Awning stripes',
    x: 352, y: 186, r: 32,
    draw(ctx, side) {
      const stripe = side === 'A' ? '#c93b2e' : '#2e6fc9';
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 === 0 ? stripe : '#f7ead0';
        ctx.fillRect(300 + i * 21, 176, 21, 22);
      }
      ctx.strokeStyle = '#5a4632';
      ctx.lineWidth = 2;
      ctx.strokeRect(300, 176, 105, 22);
    },
  },
  {
    id: 'fruit',
    label: 'Fruit crate',
    x: 122, y: 420, r: 30,
    draw(ctx, side) {
      ctx.fillStyle = '#8a5a2b';
      ctx.fillRect(96, 428, 52, 18);
      const colour = side === 'A' ? '#f28c1e' : '#c92b2b';
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.arc(106 + i * 12, 420, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = colour;
      for (const [cx, cy] of [[112, 410], [130, 410]]) {
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  {
    id: 'bulb',
    label: 'Fifth bulb',
    x: 302, y: 92, r: 24,
    draw(ctx, side) {
      ctx.fillStyle = side === 'A' ? '#ffd94d' : '#4a4a55';
      ctx.beginPath();
      ctx.arc(302, 92, 7, 0, Math.PI * 2);
      ctx.fill();
      if (side === 'A') {
        ctx.strokeStyle = 'rgba(255,217,77,0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(302, 92, 12, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
  },
  {
    id: 'fan',
    label: 'Paper fan',
    x: 252, y: 384, r: 28,
    draw(ctx, side) {
      if (side !== 'A') return;
      ctx.fillStyle = '#7fb3d5';
      ctx.beginPath();
      ctx.moveTo(252, 384);
      ctx.arc(252, 384, 22, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#2e6f8e';
      ctx.lineWidth = 2;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(252, 384);
        ctx.lineTo(252 + i * 9, 366);
        ctx.stroke();
      }
    },
  },
];

// ---------- Level 3: Garden Party ----------

const gardenDifferences = [
  {
    id: 'tulip',
    label: 'Tulip colour',
    x: 122, y: 462, r: 26,
    draw(ctx, side) {
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(122, 462);
      ctx.lineTo(122, 492);
      ctx.stroke();
      ctx.fillStyle = side === 'A' ? '#d23b2e' : '#f2c230';
      ctx.beginPath();
      ctx.ellipse(122, 452, 9, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'butterfly',
    label: 'Butterfly',
    x: 420, y: 140, r: 28,
    draw(ctx, side) {
      if (side !== 'A') return;
      ctx.fillStyle = '#e88fc0';
      for (const [wx, wy, wrx, wry, rot] of [[412, 134, 8, 11, -0.5], [428, 134, 8, 11, 0.5], [414, 148, 6, 8, -0.3], [426, 148, 6, 8, 0.3]]) {
        ctx.beginPath();
        ctx.ellipse(wx, wy, wrx, wry, rot, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#5a2b4d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(420, 132);
      ctx.lineTo(420, 152);
      ctx.stroke();
    },
  },
  {
    id: 'candles',
    label: 'Cake candles',
    x: 300, y: 296, r: 30,
    draw(ctx, side) {
      const count = side === 'A' ? 3 : 2;
      for (let i = 0; i < count; i++) {
        const cx = 288 + i * 12;
        ctx.fillStyle = '#fdf6e3';
        ctx.fillRect(cx - 2, 292, 4, 14);
        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        ctx.ellipse(cx, 288, 3, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  {
    id: 'bunting',
    label: 'Bunting flag',
    x: 204, y: 92, r: 26,
    draw(ctx, side) {
      if (side !== 'A') return;
      ctx.fillStyle = '#2e6fc9';
      ctx.beginPath();
      ctx.moveTo(192, 84);
      ctx.lineTo(216, 84);
      ctx.lineTo(204, 104);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    id: 'apples',
    label: 'Fourth apple',
    x: 508, y: 152, r: 24,
    draw(ctx, side) {
      if (side !== 'A') return;
      ctx.fillStyle = '#c92b2b';
      ctx.beginPath();
      ctx.arc(508, 152, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#5a4632';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(508, 144);
      ctx.lineTo(508, 138);
      ctx.stroke();
    },
  },
  {
    id: 'dog',
    label: 'Sleeping dog',
    x: 92, y: 484, r: 30,
    draw(ctx, side) {
      if (side !== 'A') return;
      ctx.fillStyle = '#c98a4b';
      ctx.beginPath();
      ctx.ellipse(92, 486, 26, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(116, 480, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(106, 474, 5, 8, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5a4632';
      ctx.beginPath();
      ctx.arc(120, 480, 2, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'fountain',
    label: 'Fountain spray',
    x: 452, y: 372, r: 30,
    draw(ctx, side) {
      if (side !== 'A') return;
      ctx.strokeStyle = 'rgba(127,179,213,0.9)';
      ctx.lineWidth = 3;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(452, 372);
        ctx.quadraticCurveTo(452 + i * 12, 344, 452 + i * 20, 366);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(127,179,213,0.9)';
      ctx.beginPath();
      ctx.arc(452, 340, 4, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'teacup',
    label: 'Teacup',
    x: 362, y: 330, r: 24,
    draw(ctx, side) {
      if (side !== 'A') return;
      ctx.fillStyle = '#7fb3d5';
      ctx.beginPath();
      ctx.arc(362, 330, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2e6f8e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(372, 330, 5, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#fdf6e3';
      ctx.fillRect(352, 340, 20, 3);
    },
  },
  {
    id: 'cloud',
    label: 'Small cloud',
    x: 152, y: 72, r: 28,
    draw(ctx, side) {
      if (side !== 'A') return;
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      ctx.ellipse(140, 74, 18, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(158, 70, 16, 11, 0, 0, Math.PI * 2);
      ctx.ellipse(152, 78, 20, 9, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  },
];

export const DIFFERENCES = {
  harbor: harborDifferences,
  market: marketDifferences,
  garden: gardenDifferences,
};
