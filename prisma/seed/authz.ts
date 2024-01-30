export const roles = [
    {
        id: 1,
        name: 'Admin'
    },
    {
        id: 2,
        name: 'User'
    }
];

export const permissions = [
    {
        id: 1,
        roleId: 1,
        action: 'manage',
        subject: 'all'
    },
    {
        id: 2,
        roleId: 2,
        action: 'read',
        subject: 'Story'
    },
    {
        id: 3,
        roleId: 2,
        action: 'manage',
        subject: 'Story',
        conditions: { created_by: '{{ id }}' }
    }
];
