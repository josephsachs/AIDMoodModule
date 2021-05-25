/* 

Moods
                                                                       
Shift authorial voice based on keyphrases in the AI's output        
 																	      
Customize the themes array to configure the moods of your           
scenario. 

name -       A string identifier. Will only be shown in script logs.
message -    This will be shown to the player when the mood shifts.
text -       Styles that will be placed in the A/N.
matchers -   When the output matches these regexes, the score for
             the corresponding mood increases.
threshhold - When the score for a mood reaches the threshhold, 
             the A/N will change to show the contents of 'text.'
   
Use the property 'addendum' to specify text that should be
included in the A/N regardless of the currently active mood.

Place the module into common scripts and then initialize in output.
The initialize method should receive the name of the initial theme.

Example:

MoodsModule.initialize('suspense')  
MoodsModule.execute(text)

*/

const MoodsModule = {
	themes: [
		{
			name: 'action',
			message: '!!!',
			text: 'frenetic, dramatic, aggressive',
			matchers: [
			/alarm|klaxon|siren/i, 
			/explosion|boom/i, 
			/gunfire/i,
			/the ground shakes/i,
			/you hear a? scream/i
			],
			threshold: 10
		},
		{
			name: 'suspense',
			message: '...',
			text: 'exploration, suspenseful, aesthetic',
			matchers: [
			/street is empty|streets are empty/i,
			/hear a noise|hear a sound/i,
			/corner of your eye/i
			],
			threshold: 10
		},
	],

	addendum: `anime`,

	setTheme: function(newTheme) {
		state.memory = { authorsNote: `Writing style: ${newTheme.text}, ${this.addendum}` }
		state.message = `${newTheme.message}`
		console.log(`Moods: Theme changed to ${newTheme.name}.`)
	},

	clearMessage: function() {
		state.message = ``
	},
	
	resetHitsAllThemes: function() {
		state.themes = this.themes.map((theme) => { 
			return { name: theme.name, hits: 0 }
		})
	},

	initialize: function(initialTheme) {
		if (!state.moodsInitialized) {
			state.themes = []

			state.themes = this.themes.map((theme) => { 
				return { name: theme.name, hits: 0 }
			})
			
			this.setTheme(
				state.themes.find((theme) => theme.name == initialTheme)  
			)
			
			state.moodsInitialized = true
		}
	},

	execute: function(text) {
		let thresholdMet = []

		this.themes.forEach((theme) => {
			let stateTheme = state.themes.find((element) => element.name == theme.name)

			theme.matchers.forEach((matcher) => {
				if (text.match(matcher)) {
					stateTheme.hits++
				}
			})

			if (stateTheme.hits >= theme.threshold) {
				thresholdMet.push(theme)
			}
		})
		
		if (thresholdMet[0] != undefined) {
			let newTheme = thresholdMet.sort((A,B) => Math.random - Math.random)[0]
			this.setTheme(newTheme)

			this.resetHitsAllThemes()
		} else {
			console.log(`Moods: No theme met the threshold, doing nothing...`)
			this.clearMessage()
		}
	}
}