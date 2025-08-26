interface WordBank {
    [key: string]: {
        [key: string]: string[][];  // [word, hint][]
    };
}

export const wordBank: WordBank = {
    beginner: {
        children: [
            ['cat', 'A small furry pet'],
            ['dog', 'A friendly pet that barks'],
            ['sun', 'It shines in the sky'],
            ['red', 'The color of fire'],
            ['hat', 'You wear it on your head'],
            ['toy', 'Something children play with'],
        ],
        teen: [
            ['book', 'You read this'],
            ['desk', 'You work at this'],
            ['lamp', 'It gives light'],
            ['door', 'You go through this'],
            ['cake', 'A sweet dessert'],
            ['bird', 'It can fly'],
        ],
    },
    intermediate: {
        children: [
            ['school', 'A place where you learn'],
            ['pencil', 'You write with this'],
            ['window', 'You can see through this'],
            ['flower', 'A colorful plant'],
            ['rabbit', 'A hopping animal with long ears'],
            ['yellow', 'The color of the sun'],
        ],
        teen: [
            ['student', 'Someone who learns'],
            ['teacher', 'Someone who helps you learn'],
            ['library', 'A place with many books'],
            ['computer', 'An electronic device'],
            ['bicycle', 'A two-wheeled vehicle'],
            ['picture', 'A visual image'],
        ],
    },
    advanced: {
        children: [
            ['butterfly', 'A beautiful flying insect'],
            ['elephant', 'A large gray animal'],
            ['umbrella', 'Use this when it rains'],
            ['swimming', 'Moving in water'],
            ['birthday', 'The day you were born'],
            ['airplane', 'It flies in the sky'],
        ],
        teen: [
            ['education', 'The process of learning'],
            ['adventure', 'An exciting experience'],
            ['delicious', 'Tastes very good'],
            ['beautiful', 'Pleasant to look at'],
            ['mountain', 'A very high landform'],
            ['language', 'System of communication'],
        ],
    },
};
