import useMainStore from "store";
import { useState, useEffect } from "react";

export default () => {
  const [hydrated, setHydrated] = useState(useMainStore.persist.hasHydrated);

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    const unsubHydrate = useMainStore.persist.onHydrate(() =>
      setHydrated(false)
    );

    const unsubFinishHydration = useMainStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );

    setHydrated(useMainStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
