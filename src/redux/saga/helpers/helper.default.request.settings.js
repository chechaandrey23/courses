export const defaultRequestSettings = {
	//timeout: 5000,
	responseType: 'json',
	JWTRefreshUpdate: true,
	JWTRefreshUpdateMethod: 'GET',
	JWTRefreshUpdateURL: 'https://api.wisey.app/api/v1/auth/anonymous?platform=subscriptions',
	JWTRefreshUpdateHandler: (response) => {
		return response.data.token;
	}
}
