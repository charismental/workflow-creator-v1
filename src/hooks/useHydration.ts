import useMainStore from "store";
import { useState, useEffect } from "react";

export default () => {
  const [hydrated, setHydrated] = useState(useMainStore.persist.hasHydrated);

  useEffect(() => {
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
