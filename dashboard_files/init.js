timezoneJS.timezone.zoneFileBasePath = App.config.context + '/tz';
timezoneJS.timezone.loadingScheme = timezoneJS.timezone.loadingSchemes.PRELOAD_ALL;
timezoneJS.timezone.init({async: false});
