if (!document.querySelector('#pokerole-gender-icons-style')) {
  const style = document.createElement('style');
  style.id = 'pokerole-gender-icons-style';
  style.textContent = `
    .pokerole-gender-icon {
      height: 25px;
      width: 25px;
      flex: 0 0 auto;
      margin: auto 5px auto auto;
      display: block;
      object-fit: contain;
    }
  `;
  document.head.appendChild(style);
}

/**
 * @param {string} actorId - ID actor
 */
function updateGenderIconForActor(actorId) {
  // Checking system setting
  if (game.system.id !== 'pokerole') return;
  const genderOptionEnabled = game.settings.get('pokerole', 'genderOption');
  if (!genderOptionEnabled) {
    const li = document.querySelector(`.directory-item.actor[data-entry-id="${actorId}"]`);
    if (li) {
      const icon = li.querySelector('.pokerole-gender-icon');
      if (icon) icon.remove();
    }
    return;
  }

  const actor = game.actors.get(actorId);
  if (!actor) return;

  const li = document.querySelector(`.directory-item.actor[data-entry-id="${actorId}"]`);
  if (!li) return;

  const gender = actor.system?.gender;
  const iconMap = {
    male: 'msymbol2.png',
    female: 'fsymbol2.png',
    genderless: 'osymbol2.png'
  };
  const fileName = gender && gender !== 'none' ? iconMap[gender] : null;

  // Deleting old icon
  const oldIcon = li.querySelector('.pokerole-gender-icon');
  if (oldIcon) oldIcon.remove();

  if (!fileName) return;

  const iconPath = `systems/pokerole/images/icons/${fileName}`;
  const img = document.createElement('img');
  img.src = iconPath;
  img.className = 'pokerole-gender-icon';
  img.title = gender;
  img.alt = gender;

  li.appendChild(img);
}

Hooks.on('renderActorDirectory', (app, html) => {
  if (game.system.id !== 'pokerole') return;

  const container = html instanceof jQuery ? html[0] : html;
  if (!container) return;

  const actorItems = container.querySelectorAll('.directory-item.actor');
  if (!actorItems.length) return;

  actorItems.forEach(el => {
    const actorId = el.dataset.entryId;
    if (!actorId) return;
    setTimeout(() => updateGenderIconForActor(actorId), 0);
  });
});

Hooks.on('updateActor', (actor, updateData, options, userId) => {
  if (foundry.utils.hasProperty(updateData, 'system.gender')) {
    setTimeout(() => updateGenderIconForActor(actor.id), 0);
  }
});

Hooks.on('renderSettingsConfig', () => {
});

Hooks.on('settingsChanged', (setting) => {
  if (setting.key === 'genderOption') {
    const app = ui.actors;
    if (app) app.render();
  }
});