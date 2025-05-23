// source/utilidad/backgroundTimer.js
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';

const TASK_NAME = "background-timer-task";

// Define la tarea de fondo
TaskManager.defineTask(TASK_NAME, async () => {
  try {
    // Aquí puedes lanzar una notificación o guardar tiempo en asyncStorage
    console.log("⏰ Ejecutando tarea de fondo...");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pomodoro",
        body: "Tu tiempo ha terminado (modo background)",
      },
      trigger: null,
    });

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Registra la tarea
export async function registrarTareaBackground() {
  const status = await BackgroundFetch.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);

  if (!isRegistered && status === BackgroundFetch.Status.Available) {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 60, // ejecuta cada 60 segundos
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log("✅ Tarea de fondo registrada");
  } else {
    console.log("⚠️ Ya registrada o no disponible");
  }
}
