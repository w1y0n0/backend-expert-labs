/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('comment_replies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'comments(id)',
            onDelete: 'CASCADE',
        },
        date: {
            type: 'TEXT',
            notNull: true,
        },
        is_delete: {
            type: 'BOOLEAN',
            notNull: true,
            default: false,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('comment_replies');
};