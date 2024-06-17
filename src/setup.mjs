export function setup({onInterfaceReady, settings})
{
	const btnDisplay 	= settings.section("DISPLAY");

    const buttonList = {
        bank: {
            type 		: 'switch',
            label 		: 'Bank Button',
            hint 		: 'Displays the Bank button next to the combat minibar',
            default 	: true,
            resource 	: assets.getURI("assets/media/main/bank_header.svg"),
            title 		: "bank",
            value 		: '0/0'
        },
        shop: {
            type 		: 'switch',
            label 		: 'Shop Button',
            hint 		: 'Displays the Shop button next to the combat minibar',
            default 	: true,
            resource 	: assets.getURI("assets/media/main/gp.svg"),
            title 		: "shop",
            value 		: 0
        }
    }

    psy_generateSettings(buttonList, btnDisplay);

    onInterfaceReady(ctx => {
        const dispSettings  = ctx.settings.section("DISPLAY");
        const minibar 	    = document.getElementById("combat-footer-minibar-eat-btn").parentNode;
        const btnDiv        = psy_setupBtnContainer(minibar);
        const bankBtn       = PsyMinibarButton({id: "bank", value: 0, resource: assets.getURI("assets/media/main/bank_header.svg"), enabled: dispSettings.get("bank")});
        const shopBtn       = PsyMinibarButton({id: "shop", value: 0, resource: assets.getURI("assets/media/main/gp.svg"), enabled: dispSettings.get("shop")});

        // Render components
        ui.create(bankBtn, btnDiv);
        ui.create(shopBtn, btnDiv);

        // Initialize values
        bankBtn.refresh();
        shopBtn.refresh();

        ctx.patch(Currency, "onAmountChange").after(function() {
            shopBtn.refresh();
        })
        ctx.patch(Bank, "addItem").after(function() {
            bankBtn.refresh();
        })
        ctx.patch(Bank, "addItemByID").after(function() {
            bankBtn.refresh();
        })
        ctx.patch(Bank, "addItemOnLoad").after(function() {
            bankBtn.refresh();
        })
        ctx.patch(Bank, "removeItemQuantity").after(function() {
            bankBtn.refresh();
        })
        ctx.patch(Bank, "removeItemQuantityByID").after(function() {
            bankBtn.refresh();
        })
    })
}

function psy_generateSettings(settingsList, section){
	for(const [key, setting] of Object.entries(settingsList)){
		switch(setting.type){
			case 'switch':
				section.add({
					type	: setting.type,
					name	: setting.title,
					label	: setting.label,
					hint	: setting.hint,
					default	: true
				});
				break;
			// TODO - Handle other kind of settings
		}
	}
}

function psy_setupBtnContainer(host){
    const div = document.createElement("div");

    div.id = "psy-minibar-container";
    div.classname = "";
    div.style=" margin-right: 0.3rem"

    host.prepend(div);

    return div;
}

// Components
function PsyMinibarButton(props){
	return{
		$template: "#psy-combat-footer-minibar-additions-btn",
		id: 		props.id,
		value:      props.value,
        resource:   props.resource,
        enabled:    props.enabled,
		refresh(){
            switch (this.id) {
                case "bank":
                    this.value =  (game.bank.occupiedSlots + '/' + game.bank.maximumSlots)
                    break;
                case "shop":
                    this.value = formatNumber(game.gp.amount);
                    break;
            }
        },
        gotoPage(){
            switch(this.id){
                case "bank":
                    changePage(game.pages.getObjectByID('melvorD:Bank'));
                    break;
                case "shop":
                    changePage(game.pages.getObjectByID('melvorD:Shop'));
                    break;
            }
        },
        setActive(flag){
            this.enabled = flag;
        }
	}
}
