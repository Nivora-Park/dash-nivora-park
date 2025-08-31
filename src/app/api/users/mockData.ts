// Shared mock user database - in production, this should come from your actual database
export const mockUsers = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@nivora.com',
        name: 'Admin Nivora',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
        role: 'admin',
        location_id: null,
        status: 'active',
        lastLogin: new Date().toISOString(),
        permissions: ['all'],
        terminal: 'All',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '2',
        username: 'operator',
        email: 'operator@nivora.com',
        name: 'Operator A1',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
        role: 'operator',
        location_id: 'location-1',
        status: 'active',
        lastLogin: new Date().toISOString(),
        permissions: ['terminal_a1', 'transactions', 'reports'],
        terminal: 'A1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

// Helper functions for user operations
export const findUserById = (id: string) => mockUsers.find(u => u.id === id);
export const findUserByUsername = (username: string) => mockUsers.find(u => u.username === username);
export const findUserByEmail = (email: string) => mockUsers.find(u => u.email === email);
export const findUserIndexById = (id: string) => mockUsers.findIndex(u => u.id === id);

export const addUser = (user: any) => {
    mockUsers.push(user);
    return user;
};

export const updateUser = (index: number, userData: any) => {
    mockUsers[index] = { ...mockUsers[index], ...userData };
    return mockUsers[index];
};

export const removeUser = (index: number) => {
    return mockUsers.splice(index, 1)[0];
};
