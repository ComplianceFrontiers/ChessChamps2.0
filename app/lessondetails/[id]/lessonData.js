// app/lessondetails/lessonData.js

const lessonContent = {
    "1.1": {
      level: "Pawn",
      title: "The Board and the Pieces",
      duration: "5:23",
      status: "Completed",
      description:
        "Learn about the chessboard layout and get familiar with all the different pieces and their placement.",
      image: "/lessonimages/lessond.png",
      resources: [
        { name: "Chess Board Basics PDF", link: "#" },
        { name: "Printable Piece Guide", link: "#" },
      ],
    },
    "1.2": {
      level: "Pawn",
      title: "How the Pieces Move",
      duration: "6:42",
      status: "In Progress",
      description:
        "Understand how each chess piece moves across the board including special moves like castling and en passant.",
      image: "/lessonimages/lessond.png",
      resources: [{ name: "Movement Rules Chart", link: "#" }],
    },
    // Add more lessons like "1.3", "2.1" (Knight), etc.
  };
  
  export default lessonContent;
  