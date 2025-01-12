export const getRandomGreeting = () => {
	const now = new Date();
	const hour = now.getHours();

	let greetings: string[] = [];

	if (hour >= 23) {
		greetings = ['Night-owl mode activated', 'Sleep is for the weak', 'Good night', 'Have a good rest', 'Late nights are for coding', 'I\'m your fortune cookie', 'The agent takes over', 'Who said nights are for sleep', 'Maybe go to bed early today', 'Time to recharge for tomorrow', 'Sweet dreams are made of this', 'May the moon guide you', 'Let the stars be your guide', 'Sleep tight, don\'t let the bed bugs bite'];
	} else if (hour >= 20) {
		greetings = ['Time to unwind', 'Time to ponder on the day', 'See you space cowboy', 'Good night', 'Relaxation mode activated', 'Unwind with a good book', 'Let the evening calm you', 'Take a deep breath, it\'s evening', 'Evening vibes only', 'Let the stars guide you tonight'];
	} else if (hour >= 18) {
		greetings = ['Pack up and head home', 'Have a safe way home', 'Enjoy your dinner', 'Winner winner chicken dinner', 'Time to prep for dinner', 'Good job today', 'Try again tomorrow'];
	} else if (hour >= 15) {
		greetings = ['Time to slack a bit', 'The job is almost done', 'Work hard play hard', 'Good afternoon', 'Time for a break', 'Take a moment to relax', 'Your afternoon pick-me-up'];
	} else if (hour >= 12) {
		greetings = ['Enjoy your lunch time', 'Lunch prep time', 'Good job this morning', 'Power-up with lunch', 'Time to refuel', 'Food coma incoming'];
	} else if (hour >= 9) {
		greetings = ['What a wonderful morning', 'This is gonna be your day', 'Greetings and salutations', 'New day new dream', 'Good morning', 'Rise and shine, it\'s coffee time'];
	} else if (hour >= 6) {
		greetings = ['The early bird catches the worm', 'Rise and shine', 'Another day another story', 'Take it easy today', 'You are early', 'Time to get crackin\''];
	} else if (hour >= 3) {
		greetings = ['Time to go to bed', 'Dead-tired pixels', 'Conscious in a dream', 'Stay a little more', 'Witching hour', 'Taking on the night shift'];
	} else {
		greetings = ['Sleep is still for the weak', 'Your night shift just started', 'Today is young', 'Midnight munchies are calling', 'Midnight is the new morning'];
	}

	return greetings[Math.floor(Math.random() * greetings.length)];
};
