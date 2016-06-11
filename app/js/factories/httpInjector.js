module.exports 	= function (loginFactory)
{
	return {
		request: function (config)
		{
			if (loginFactory.isLoggedIn())
			{
				console.log("Hello");
				config.headers['x-username'] 	= loginFactory.getEmail();
				config.headers['x-token'] 		= loginFactory.getToken();
			}

			return config;
		}
	};
};