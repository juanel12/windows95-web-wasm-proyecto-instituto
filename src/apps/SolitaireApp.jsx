import React, { useState, useCallback } from 'react';
import { playClickSound, playVictorySound } from '../utils/win95Sound';
import { CordilleraSymbolIcon } from '../components/Win95Icons';

const SUITS = [
  { id: 'spades', symbol: '♠', color: 'black' },
  { id: 'hearts', symbol: '♥', color: 'red' },
  { id: 'diamonds', symbol: '♦', color: 'red' },
  { id: 'clubs', symbol: '♣', color: 'black' },
];

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (let i = 0; i < RANKS.length; i++) {
      deck.push({
        id: `${suit.id}-${i + 1}`,
        suit: suit.id,
        symbol: suit.symbol,
        color: suit.color,
        rank: i + 1,
        label: RANKS[i],
        faceUp: false,
      });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealGame() {
  const deck = createDeck();
  const tableau = Array.from({ length: 7 }, () => []);
  let idx = 0;

  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[idx++], faceUp: row === col };
      tableau[col].push(card);
    }
  }

  return {
    stock: deck.slice(idx).map((c) => ({ ...c, faceUp: false })),
    waste: [],
    foundations: [[], [], [], []],
    tableau,
    moves: 0,
    score: 0,
  };
}

export default function SolitaireApp() {
  const [game, setGame] = useState(() => dealGame());
  const [selected, setSelected] = useState(null); // { source: 'waste'|'tableau'|'foundation', index: number, cardIndex?: number }

  const resetGame = useCallback(() => {
    playClickSound();
    setGame(dealGame());
    setSelected(null);
  }, []);

  const isWon = game.foundations.every((f) => f.length === 13);

  const handleStockClick = () => {
    playClickSound();
    setSelected(null);
    setGame((prev) => {
      if (prev.stock.length > 0) {
        const nextCard = { ...prev.stock[prev.stock.length - 1], faceUp: true };
        return {
          ...prev,
          stock: prev.stock.slice(0, -1),
          waste: [...prev.waste, nextCard],
          moves: prev.moves + 1,
        };
      }
      if (prev.waste.length > 0) {
        return {
          ...prev,
          stock: [...prev.waste].reverse().map((c) => ({ ...c, faceUp: false })),
          waste: [],
          moves: prev.moves + 1,
          score: Math.max(0, prev.score - 20),
        };
      }
      return prev;
    });
  };

  const canPlaceOnFoundation = (card, pile) => {
    if (pile.length === 0) return card.rank === 1;
    const top = pile[pile.length - 1];
    return top.suit === card.suit && card.rank === top.rank + 1;
  };

  const canPlaceOnTableau = (card, pile) => {
    if (pile.length === 0) return card.rank === 13;
    const top = pile[pile.length - 1];
    return top.faceUp && top.color !== card.color && card.rank === top.rank - 1;
  };

  const tryAutoMoveToFoundation = (source, colIdx, cardIdx) => {
    const movingCard =
      source === 'waste'
        ? game.waste[game.waste.length - 1]
        : game.tableau[colIdx][cardIdx];

    if (!movingCard) return false;
    if (source === 'tableau' && cardIdx !== game.tableau[colIdx].length - 1) return false;

    const targetFIdx = game.foundations.findIndex((f) => canPlaceOnFoundation(movingCard, f));
    if (targetFIdx === -1) return false;

    setGame((prev) => {
      const next = {
        ...prev,
        foundations: prev.foundations.map((f, i) => (i === targetFIdx ? [...f, movingCard] : f)),
        waste: source === 'waste' ? prev.waste.slice(0, -1) : prev.waste,
        tableau: prev.tableau.map((col, i) => {
          if (source !== 'tableau' || i !== colIdx) return col;
          const sliced = col.slice(0, -1);
          if (sliced.length > 0 && !sliced[sliced.length - 1].faceUp) {
            sliced[sliced.length - 1] = { ...sliced[sliced.length - 1], faceUp: true };
          }
          return sliced;
        }),
        moves: prev.moves + 1,
        score: prev.score + 10,
      };
      if (next.foundations.every((f) => f.length === 13)) {
        playVictorySound();
      } else {
        playClickSound();
      }
      return next;
    });
    setSelected(null);
    return true;
  };

  const moveSelectedToFoundation = (fIdx) => {
    if (!selected) return;
    let movingCard = null;
    if (selected.source === 'waste') {
      movingCard = game.waste[game.waste.length - 1];
    } else if (selected.source === 'tableau') {
      const col = game.tableau[selected.index];
      if (selected.cardIndex !== col.length - 1) {
        setSelected(null);
        return;
      }
      movingCard = col[col.length - 1];
    }

    if (!movingCard || !canPlaceOnFoundation(movingCard, game.foundations[fIdx])) {
      setSelected(null);
      return;
    }

    setGame((prev) => {
      const next = {
        ...prev,
        foundations: prev.foundations.map((f, i) => (i === fIdx ? [...f, movingCard] : f)),
        waste: selected.source === 'waste' ? prev.waste.slice(0, -1) : prev.waste,
        tableau: prev.tableau.map((col, i) => {
          if (selected.source !== 'tableau' || i !== selected.index) return col;
          const sliced = col.slice(0, -1);
          if (sliced.length > 0 && !sliced[sliced.length - 1].faceUp) {
            sliced[sliced.length - 1] = { ...sliced[sliced.length - 1], faceUp: true };
          }
          return sliced;
        }),
        moves: prev.moves + 1,
        score: prev.score + 10,
      };
      if (next.foundations.every((f) => f.length === 13)) {
        playVictorySound();
      } else {
        playClickSound();
      }
      return next;
    });
    setSelected(null);
  };

  const moveSelectedToTableau = (targetColIdx) => {
    if (!selected) return;
    if (selected.source === 'tableau' && selected.index === targetColIdx) {
      setSelected(null);
      return;
    }

    let movingCards = [];
    if (selected.source === 'waste') {
      const top = game.waste[game.waste.length - 1];
      if (top) movingCards = [top];
    } else if (selected.source === 'tableau') {
      movingCards = game.tableau[selected.index].slice(selected.cardIndex);
    } else if (selected.source === 'foundation') {
      const top = game.foundations[selected.index][game.foundations[selected.index].length - 1];
      if (top) movingCards = [top];
    }

    if (movingCards.length === 0) {
      setSelected(null);
      return;
    }

    if (!canPlaceOnTableau(movingCards[0], game.tableau[targetColIdx])) {
      setSelected(null);
      return;
    }

    setGame((prev) => {
      const nextTableau = prev.tableau.map((col, i) => {
        if (i === targetColIdx) return [...col, ...movingCards];
        if (selected.source === 'tableau' && i === selected.index) {
          const sliced = col.slice(0, selected.cardIndex);
          if (sliced.length > 0 && !sliced[sliced.length - 1].faceUp) {
            sliced[sliced.length - 1] = { ...sliced[sliced.length - 1], faceUp: true };
          }
          return sliced;
        }
        return col;
      });

      return {
        ...prev,
        waste: selected.source === 'waste' ? prev.waste.slice(0, -1) : prev.waste,
        foundations: prev.foundations.map((f, i) =>
          selected.source === 'foundation' && i === selected.index ? f.slice(0, -1) : f
        ),
        tableau: nextTableau,
        moves: prev.moves + 1,
        score: prev.score + 5,
      };
    });
    playClickSound();
    setSelected(null);
  };

  const renderCardFace = (card, isSel = false) => (
    <div
      style={{
        width: 58,
        height: 80,
        background: '#ffffff',
        border: isSel ? '2px solid #0000ff' : '1px solid #000000',
        borderRadius: 4,
        boxShadow: isSel ? '0 0 0 2px #ffff00' : '1px 1px 2px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2px 4px',
        boxSizing: 'border-box',
        color: card.color === 'red' ? '#cc0000' : '#000000',
        fontWeight: 'bold',
        fontSize: 12,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{card.label}</span>
        <span>{card.symbol}</span>
      </div>
      <div style={{ textAlign: 'center', fontSize: 22, lineHeight: 1 }}>{card.symbol}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', transform: 'rotate(180deg)' }}>
        <span>{card.label}</span>
        <span>{card.symbol}</span>
      </div>
    </div>
  );

  const renderCardBack = () => (
    <div
      style={{
        width: 58,
        height: 80,
        background: 'linear-gradient(135deg, #004d40 0%, #002b24 100%)',
        border: '2px solid #ffffff',
        outline: '1px solid #000000',
        borderRadius: 4,
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CordilleraSymbolIcon size={28} color="#1ae585" />
      <span style={{ fontSize: 7, color: '#b2f5ea', fontWeight: 'bold', letterSpacing: 0.4 }}>
        CORDILLERA
      </span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Barra de controles */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 6px',
          background: '#c0c0c0',
          borderBottom: '1px solid #808080',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button type="button" onClick={resetGame}>Nuevo Juego</button>
          <span style={{ fontSize: 11 }}>Clic para seleccionar/mover · Doble clic para subir a fundación</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 'bold' }}>
          Puntos: {game.score} | Movs: {game.moves}
        </div>
      </div>

      {/* Tapete verde clásico de Solitario */}
      <div
        style={{
          flex: 1,
          background: '#007f00',
          padding: 12,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
        }}
        onClick={() => setSelected(null)}
      >
        {/* Fila superior: Mazo + Descarte + 4 Fundaciones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleStockClick();
              }}
              style={{
                width: 58,
                height: 80,
                border: '1px dashed rgba(255,255,255,0.5)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
              }}
              title="Robar carta"
            >
              {game.stock.length > 0 ? renderCardBack() : '↻'}
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                if (game.waste.length === 0) return;
                if (
                  selected?.source === 'waste'
                ) {
                  setSelected(null);
                } else {
                  setSelected({ source: 'waste', index: 0 });
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                tryAutoMoveToFoundation('waste', 0, 0);
              }}
              style={{
                width: 58,
                height: 80,
                border: '1px dashed rgba(255,255,255,0.35)',
                borderRadius: 4,
              }}
            >
              {game.waste.length > 0 &&
                renderCardFace(
                  game.waste[game.waste.length - 1],
                  selected?.source === 'waste'
                )}
            </div>
          </div>

          {/* Fundaciones */}
          <div style={{ display: 'flex', gap: 8 }}>
            {game.foundations.map((pile, fIdx) => (
              <div
                key={fIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selected) {
                    moveSelectedToFoundation(fIdx);
                  } else if (pile.length > 0) {
                    setSelected({ source: 'foundation', index: fIdx });
                  }
                }}
                style={{
                  width: 58,
                  height: 80,
                  border: '2px inset rgba(255,255,255,0.45)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 22,
                  cursor: 'pointer',
                }}
              >
                {pile.length > 0
                  ? renderCardFace(
                      pile[pile.length - 1],
                      selected?.source === 'foundation' && selected.index === fIdx
                    )
                  : 'A'}
              </div>
            ))}
          </div>
        </div>

        {/* 7 Columnas del tablero */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 58px)', gap: 10 }}>
          {game.tableau.map((col, colIdx) => (
            <div
              key={colIdx}
              onClick={(e) => {
                e.stopPropagation();
                if (selected) moveSelectedToTableau(colIdx);
              }}
              style={{
                position: 'relative',
                minHeight: 160,
                border: col.length === 0 ? '1px dashed rgba(255,255,255,0.35)' : 'none',
                borderRadius: 4,
              }}
            >
              {col.map((card, cardIdx) => {
                const isSel =
                  selected?.source === 'tableau' &&
                  selected.index === colIdx &&
                  cardIdx >= selected.cardIndex;

                return (
                  <div
                    key={card.id}
                    style={{
                      position: 'absolute',
                      top: cardIdx * 20,
                      left: 0,
                      zIndex: cardIdx + 1,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!card.faceUp) return;
                      if (selected) {
                        moveSelectedToTableau(colIdx);
                      } else {
                        setSelected({ source: 'tableau', index: colIdx, cardIndex: cardIdx });
                      }
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (card.faceUp) tryAutoMoveToFoundation('tableau', colIdx, cardIdx);
                    }}
                  >
                    {card.faceUp ? renderCardFace(card, isSel) : renderCardBack()}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {isWon && (
          <div
            className="window"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: 16,
              zIndex: 50,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
              🎉 ¡Felicidades! Ganaste en {game.moves} movimientos
            </div>
            <button type="button" onClick={resetGame}>Jugar otra vez</button>
          </div>
        )}
      </div>
    </div>
  );
}
