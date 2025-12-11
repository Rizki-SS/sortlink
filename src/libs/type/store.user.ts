export default interface AppStore {
    user: {
        sub: string;
        project_id: string;
        branch_id: string;
        refresh_token_id: string;
        role: string;
        name: string;
        email: string;
        email_verified: boolean;
        selected_teamId: string;
        is_anonymous: boolean;
        iss: string;
        iat: number;
        aud: string;
        exp: number;
    }
}