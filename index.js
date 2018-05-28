const miio = require('miio');
let Service, Characteristic;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory('homebridge-mi-camera', 'MiCamera', MiCamera);
}

function MiCamera(log, config) {
	this.log = log;
	this.name = config.name || 'Mi Camera';
	this.ip = config.ip;
	this.token = config.token;

	if (!this.ip) {
		throw new Error('Your must provide IP address of the camera.');
	}

	if (!this.token) {
		throw new Error('Your must provide token of the camera.');
	}

	this.service = new Service.Switch(this.name);

	this.serviceInfo = new Service.AccessoryInformation();

	this.serviceInfo
		.setCharacteristic(Characteristic.Manufacturer, 'Xiaomi')
		.setCharacteristic(Characteristic.Model, 'Mi Camera')
		.setCharacteristic(Characteristic.SerialNumber, '33CB-8AE2-487111E7A919');

	this.service
		.getCharacteristic(Characteristic.On)
		.on('get', this.getPowerState.bind(this))
		.on('set', this.setPowerState.bind(this));

	this.discover();
}

MiCamera.prototype = {
	discover: async function() {
		var accessory = this;
		var log = this.log;

		log.debug('Discovering Mi Camera at "%s"', this.ip);

		this.device = await miio.device({
			address: this.ip,
			token: this.token,
			model: 'chuangmi.camera.xiaobai'
		});
	},

	getPowerState: async function(callback) {
		if (!this.device) {
			callback(new Error('No camera is discovered.'));
			return;
		}

		var log = this.log;

		await this.device.call('get_devicestatus', [{'alarmsensitivity': '', 'infraredlight': '', 'cameraprompt': '', 'ledstatus': '', 'wakeuplevel': '', 'recordtype': ''}])
			.then(function(data) {
				log.debug(data);

				data.forEach(function(item, index) {
					if (item.sysstatus && item.sysstatus == 'sleep') {
						callback(null, false);
						return;
					}

					if (item.wakeuplevel && item.wakeuplevel == '2') {
						callback(null, true);
						return;
					}
				});
			})
			.catch(console.error);
	},

	setPowerState: async function(state, callback) {
		if (!this.device) {
			callback(new Error('No camera is discovered.'));
			return;
		}

		await this.device.call('set_sysstatus', [{'cmd':(state) ? 'normal' : 'sleep'}]);
		callback();
	},

	identify: function(callback) {
		callback();
	},

	getServices: function() {
		return [this.serviceInfo, this.service];
	}
};
