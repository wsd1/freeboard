// # Building a Freeboard Plugin
//
// A freeboard plugin is simply a javascript file that is loaded into a web page after the main freeboard.js file is loaded.
//
// 插件就是js文件，在freeboard.js加载后被加载
//
// Let's get started with an example of a datasource plugin and a widget plugin.
//
// -------------------

// Best to encapsulate your plugin in a closure, although not required.

// 最好包装一下 不是必须的

(function()
{
	// ## A Datasource Plugin （数据源插件）
	//
	// -------------------
	// ### Datasource Definition 
	//
	// -------------------
	// **freeboard.loadDatasourcePlugin(definition)** tells freeboard that we are giving it a datasource plugin. It expects an object with the following:
	freeboard.loadDatasourcePlugin({
		// **type_name** (required) : 防冲突名称 A unique name for this plugin. This name should be as unique as possible to avoid collisions with other plugins, and should follow naming conventions for javascript variable and function declarations.
		"type_name"   : "my_datasource_plugin",
		// **display_name** : 表面名称，没有就使用防冲突名称 The pretty name that will be used for display purposes for this plugin. If the name is not defined, type_name will be used instead.
		"display_name": "Datasource Plugin Example",
        // **description** : A description of the plugin. This description will be displayed when the plugin is selected or within search results (in the future). The description may contain HTML if needed.
        "description" : "Some sort of description <strong>with optional html!</strong>",
		// **external_scripts** : Any external scripts that should be loaded before the plugin instance is created.
		"external_scripts" : [
			"http://mydomain.com/myscript1.js",
		    "http://mydomain.com/myscript2.js"
		],
		// **settings** : 设定表达用数组表示 An array of settings that will be displayed for this plugin when the user adds it.
		"settings"    : [
			{
				// **name** (required) : 设定项目的名称 The name of the setting. This value will be used in your code to retrieve the value specified by the user. This should follow naming conventions for javascript variable and function declarations.
				"name"         : "first_name",
				// **display_name** : The pretty name that will be shown to the user when they adjust this setting.
				"display_name" : "First Name",
				// **type** (required) : The type of input expected for this setting. "text" will display a single text box input. Examples of other types will follow in this documentation.
				"type"         : "text",
				// **default_value** : A default value for this setting.
				"default_value": "John",
				// **description** : Text that will be displayed below the setting to give the user any extra information.
				"description"  : "This is pretty self explanatory...",
                // **required** : If set to true, the field will be required to be filled in by the user. Defaults to false if not specified.
                "required" : true
			},
			{
				"name"        : "last_name",
				"display_name": "Last Name",
				// **type "calculated"** : This is a special text input box that may contain javascript formulas and references to datasources in the freeboard.
				"type"        : "calculated"
			},
            {
                "name"        : "age",
                "display_name": "Age",
                // **type "number"** : A data of a numerical type. Requires the user to enter a numerical value
                "type"        : "number"
            },
			{
				"name"        : "is_human",
				"display_name": "I am human",
				// **type "boolean"** : Will display a checkbox indicating a true/false setting.
				"type"        : "boolean"
			},
			{
				"name"        : "age",
				"display_name": "Your age",
				// **type "option"** : Will display a dropdown box with a list of choices.
				"type"        : "option",
				// **options** (required) : An array of options to be populated in the dropdown.
				"options"     : [
					{
						// **name** (required) : The text to be displayed in the dropdown.
						"name" : "0-50",
						// **value** : The value of the option. If not specified, the name parameter will be used.
						"value": "young"
					},
					{
						"name" : "51-100",
						"value": "old"
					}
				]
			},
			{
				"name"        : "other",
				"display_name": "Other attributes",
				// **type "array"** : Will allow a user to enter in rows of data.
				"type"        : "array",
				// **settings** (required) : An array of columns of the text to be entered by the user.
				"settings"    : [
					{
						"name"        : "name",
						"display_name": "Name",
						"type"        : "text"
					},
					{
						"name"        : "value",
						"display_name": "Value",
						"type"        : "text"
					}
				]
			},
			{
				"name"         : "refresh_time",
				"display_name" : "Refresh Time",
				"type"         : "text",
				"description"  : "In milliseconds",
				"default_value": 5000
			}
		],
		// **newInstance(settings, newInstanceCallback, updateCallback)** (required) : 当需要这个插件实例时被调用 A function that will be called when a new instance of this plugin is requested.
		// * **settings** : 这个就是对应 前面设定描述 所输出的具体对象 A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
		// * **newInstanceCallback** : 插件实例化之后回调，参数就是插件实例本身 A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
		// * **updateCallback** : 如果数据源有了变化，你需要调用该回调，这个回调的参数就是新数据。只要数据变化，就用这个回调，可以被引用到合适的位置。 A callback function that you'll call if and when your datasource has an update for freeboard to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.
		newInstance   : function(settings, newInstanceCallback, updateCallback)
		{
			// myDatasourcePlugin is defined below.
			newInstanceCallback(new myDatasourcePlugin(settings, updateCallback));
		}
	});


	// ### Datasource Implementation
	//
	// -------------------
	// 这就是插件实例化之后，被new的对象，见上面。 Here we implement the actual datasource plugin. We pass in the settings and updateCallback.
	var myDatasourcePlugin = function(settings, updateCallback)
	{
		// Always a good idea...
		var self = this;

		// 自己保留好配置是个好方式  Good idea to create a variable to hold on to our settings, because they might change in the future. See below.
		var currentSettings = settings;

		/* This is some function where I'll get my data from somewhere */
		function getData()
		{
			var newData = { hello : "world! it's " + new Date().toLocaleTimeString() }; // Just putting some sample data in for fun.

			/* Get my data from somewhere and populate newData with it... Probably a JSON API or something. */
			/* ... */

			// 调用以更新数据  I'm calling updateCallback to tell it I've got new data for it to munch on.
			updateCallback(newData);
		}

		// 也可以定时获取数据，反正都可以使用 updateCallback 来更新数据。You'll probably want to implement some sort of timer to refresh your data every so often.
		var refreshTimer;

		function createRefreshTimer(interval)
		{
			if(refreshTimer)
			{
				clearInterval(refreshTimer);
			}

			refreshTimer = setInterval(function()
			{
				// Here we call our getData function to update freeboard with new data.
				getData();
			}, interval);
		}

		// **onSettingsChanged(newSettings)** (required) : 这个是必须实现的，参数变化会被调用。 A public function we must implement that will be called when a user makes a change to the settings.
		self.onSettingsChanged = function(newSettings)
		{
			// Here we update our current settings with the variable that is passed in.
			currentSettings = newSettings;
		}

		// **updateNow()** (required) : 这个是必须实现的，刷新时会被调用 A public function we must implement that will be called when the user wants to manually refresh the datasource
		self.updateNow = function()
		{
			// Most likely I'll just call getData() here.
			getData();
		}

		// **onDispose()** (required) : 这个是必须实现的，销毁时被调用 A public function we must implement that will be called when this instance of this plugin is no longer needed. Do anything you need to cleanup after yourself here.
		self.onDispose = function()
		{
			// Probably a good idea to get rid of our timer.
			clearInterval(refreshTimer);
			refreshTimer = undefined;
		}

		// Here we call createRefreshTimer with our current settings, to kick things off, initially. Notice how we make use of one of the user defined settings that we setup earlier.
		createRefreshTimer(currentSettings.refresh_time);
	}


	// ## A Widget Plugin
	//
	// -------------------
	// ### Widget Definition 小部件 
	//
	// -------------------
	// **freeboard.loadWidgetPlugin(definition)** tells freeboard that we are giving it a widget plugin. It expects an object with the following:
	freeboard.loadWidgetPlugin({
		// Same stuff here as with datasource plugin.
		"type_name"   : "my_widget_plugin",
		"display_name": "Widget Plugin Example",
        "description" : "Some sort of description <strong>with optional html!</strong>",
		// **external_scripts** : Any external scripts that should be loaded before the plugin instance is created.
		"external_scripts": [
			"http://mydomain.com/myscript1.js", "http://mydomain.com/myscript2.js"
		],
		// **fill_size** : 为真表示允许占满给予的空间 If this is set to true, the widget will fill be allowed to fill the entire space given it, otherwise it will contain an automatic padding of around 10 pixels around it.
		"fill_size" : false,
		"settings"    : [
			{
				"name"        : "the_text",
				"display_name": "Some Text",
				// **注意下：** 这个设定是calculated类型，表示会动态改变的，比如数据源变动。 We'll use a calculated setting because we want what's displayed in this widget to be dynamic based on something changing (like a datasource).
				"type"        : "calculated"
			},
			{
				"name"        : "size",
				"display_name": "Size",
				"type"        : "option",
				"options"     : [
					{
						"name" : "Regular",
						"value": "regular"
					},
					{
						"name" : "Big",
						"value": "big"
					}
				]
			}
		],
		// Same as with datasource plugin, but there is no updateCallback parameter in this case.
		newInstance   : function(settings, newInstanceCallback)
		{
			newInstanceCallback(new myWidgetPlugin(settings));
		}
	});

	// ### Widget Implementation
	//
	// -------------------
	// Here we implement the actual widget plugin. We pass in the settings;
	var myWidgetPlugin = function(settings)
	{
		var self = this;
		var currentSettings = settings;

		// Here we create an element to hold the text we're going to display. We're going to set the value displayed in it below.
		var myTextElement = $("<span></span>");

		// **render(containerElement)** (required) : 显而易见的必须方法，render！！！参数是个div对象，其包围着插件dom对象。 A public function we must implement that will be called when freeboard wants us to render the contents of our widget. The container element is the DIV that will surround the widget.
		self.render = function(containerElement)
		{
			// 简单处理，就是在容器中添加元素 Here we append our text element to the widget container element.
			$(containerElement).append(myTextElement);
		}

		// **getHeight()** (required) : 必须的方法， freeboard 会在需要确定尺寸的时候调用这个方法，设置改动时会被调用。 A public function we must implement that will be called when freeboard wants to know how big we expect to be when we render, and returns a height. This function will be called any time a user updates their settings (including the first time they create the widget).
		//
		// 这里的高度是用块做单位的，块的尺寸是300x45 px Note here that the height is not in pixels, but in blocks. A block in freeboard is currently defined as a rectangle that is fixed at 300 pixels wide and around 45 pixels multiplied by the value you return here.
		//
		// Blocks of different sizes may be supported in the future.
		self.getHeight = function()
		{
			if(currentSettings.size == "big")
			{
				return 2;
			}
			else
			{
				return 1;
			}
		}

		// **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
		self.onSettingsChanged = function(newSettings)
		{
			// Normally we'd update our text element with the value we defined in the user settings above (the_text), but there is a special case for settings that are of type **"calculated"** -- see below.
			currentSettings = newSettings;
		}

		// **onCalculatedValueChanged(settingName, newValue)** (required) : 必须实现，专用于calculated类型的setting。 变动时，该方法会被调用。A public function we must implement that will be called when a calculated value changes. Since calculated values can change at any time (like when a datasource is updated) we handle them in a special callback function here.
		self.onCalculatedValueChanged = function(settingName, newValue)
		{
			// Remember we defined "the_text" up above in our settings.
			if(settingName == "the_text")
			{
				// Here we do the actual update of the value that's displayed in on the screen.
				$(myTextElement).html(newValue);
			}
		}

		// **onDispose()** (required) : Same as with datasource plugins.
		self.onDispose = function()
		{
		}
	}
}());