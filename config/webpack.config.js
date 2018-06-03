var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

module.exports = function () {
      var config_env;
      if(process.env.CONFIG_ENV === undefined){
        config_env = process.env.IONIC_ENV;
      }
      else{
        config_env = process.env.CONFIG_ENV;
      }
      useDefaultConfig[process.env.IONIC_ENV].resolve.alias = {
                "@environment": path.resolve(__dirname + '/../config/config.' + config_env + '.ts'),
                    };
      console.log("useDefaultConfig",useDefaultConfig[process.env.IONIC_ENV]);
      console.log("config_env",config_env);
      return useDefaultConfig;
};
